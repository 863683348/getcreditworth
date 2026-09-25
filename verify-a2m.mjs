// A2M 本地端到端验证脚本（仅本地沙箱联调，不依赖真实支付宝网关）
import { readFile } from 'node:fs/promises';
import { createPublicKey, createPrivateKey, createSign, verify } from 'node:crypto';

const BASE = 'http://localhost:3000/api/v1/credit-worth';
const UA = 'Mozilla/5.0 (verify-a2m)';
const CLIENT_ID = 'verify-' + Date.now();
const ASINS = ['B0CPMLBV5M', 'B0B3GV3LH4', 'B09FXFM9QD'];

async function loadEnvLocal() {
  const raw = (await readFile(new URL('.env.local', import.meta.url), 'utf8')).toString();
  const kv = {};
  for (const line of raw.split('\n')) {
    const m = /^([A-Z0-9_]+)=(.*)$/.exec(line.trim());
    if (m) kv[m[1]] = m[2];
  }
  return kv;
}

function b64urlDecode(s) {
  let n = s.replace(/-/g, '+').replace(/_/g, '/');
  while (n.length % 4) n += '=';
  return Buffer.from(n, 'base64').toString('utf8');
}

function billSignContent(bill) {
  const p = bill.protocol;
  const params = {
    amount: p.amount,
    currency: 'CNY',
    goods_name: bill.method.goods_name,
    out_trade_no: p.out_trade_no,
    pay_before: p.pay_before,
    resource_id: p.resource_id,
    seller_id: bill.method.seller_id,
    service_id: bill.method.service_id,
  };
  return Object.keys(params)
    .filter((k) => params[k] !== null && params[k] !== undefined && params[k] !== '')
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join('&');
}

function verifySellerSignature(bill, env) {
  const content = billSignContent(bill);
  const pub = createPublicKey({ key: Buffer.from(env.ALIPAY_PUBLIC_KEY, 'base64'), format: 'der', type: 'spki' });
  const pubOk = verify('RSA-SHA256', Buffer.from(content, 'utf8'), pub, Buffer.from(bill.protocol.seller_signature, 'base64'));
  // 用私钥重签比对，确认字段口径与配对
  let resignMatch = false;
  try {
    const priv = createPrivateKey({ key: Buffer.from(env.ALIPAY_APP_PRIVATE_KEY, 'base64'), format: 'der', type: 'pkcs1' });
    const resign = createSign('RSA-SHA256').update(content, 'utf8').sign(priv, 'base64');
    resignMatch = resign === bill.protocol.seller_signature;
  } catch (e) {
    resignMatch = 'privErr:' + e.message;
  }
  return { pubOk, resignMatch, content };
}

const env = await loadEnvLocal();
const results = [];
function step(name, ok, detail) {
  results.push({ name, ok, detail });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? '  ::  ' + detail : ''}`);
}
const headers = (extra = {}) => ({ 'User-Agent': UA, 'x-client-id': CLIENT_ID, ...extra });

// 1. GET 自述 + quota
const g = await fetch(BASE, { headers: headers() });
const gj = await g.json();
step('GET 200', g.status === 200, `quota=${JSON.stringify(gj.data?.quota)} price=${gj.data?.price_cny} protocol=${gj.data?.protocol}`);

// 2. 第一次 POST（额度内）→ 200
const r1 = await fetch(BASE, {
  method: 'POST',
  headers: headers({ 'Content-Type': 'application/json' }),
  body: JSON.stringify({ asins: ASINS, monthly_credits: 1 }),
});
const h1 = Object.fromEntries(r1.headers.entries());
step('POST#1 200 (quota)', r1.status === 200, `Paid-Via=${h1['x-credit-worth-paid-via']} Remaining=${h1['x-credit-worth-quota-remaining']}`);

// 3. 第二次 POST（额度用尽）→ 402 + Payment-Needed
const r2 = await fetch(BASE, {
  method: 'POST',
  headers: headers({ 'Content-Type': 'application/json' }),
  body: JSON.stringify({ asins: ASINS, monthly_credits: 1 }),
});
const h2 = Object.fromEntries(r2.headers.entries());
const needed = h2['payment-needed'];
step('POST#2 402 (quota exhausted)', r2.status === 402 && !!needed, `status=${r2.status} hasBill=${!!needed} OrderId=${h2['x-payment-order-id']} Amount=${h2['x-payment-amount']} ServiceId=${h2['x-payment-service-id']}`);

// 4. 解析账单 + 验签
let billOk = false, signOk = false, billParsed = null, signDiag = '';
if (needed) {
  try {
    billParsed = JSON.parse(b64urlDecode(needed));
    billOk = !!(billParsed.protocol?.out_trade_no && billParsed.protocol?.amount && billParsed.protocol?.seller_signature);
    const d = verifySellerSignature(billParsed, env);
    signOk = d.pubOk;
    if (!d.pubOk) {
      console.log('  [diag] privPrefix=', env.ALIPAY_APP_PRIVATE_KEY.slice(0, 24));
      console.log('  [diag] content=', JSON.stringify(d.content));
      console.log('  [diag] billSig=', billParsed.protocol.seller_signature.slice(0, 40));
      if (typeof d.resignMatch === 'string') console.log('  [diag] resignErr=', d.resignMatch);
    }
    signDiag = `pubVerify=${d.pubOk} resignMatch=${d.resignMatch}`;
  } catch (e) {
    signDiag = e.message;
  }
}
step('账单结构完整', billOk, `out_trade_no=${billParsed?.protocol?.out_trade_no}`);
step('商家签名验签通过', signOk, signDiag);

// 5. 订单落盘
let orderFileOk = false, orderPath = '';
if (billParsed?.protocol?.out_trade_no) {
  orderPath = new URL(`.a2m-orders/${billParsed.protocol.out_trade_no}.json`, import.meta.url);
  try {
    const o = JSON.parse((await readFile(orderPath)).toString());
    orderFileOk = o.orderStatus === 'PENDING_PAYMENT' && o.fulfillStatus === 'UNFULFILLED' && o.resourceId === '/api/v1/credit-worth';
  } catch {}
}
step('订单落盘 (file store)', orderFileOk, orderPath ? orderPath.pathname.split('/').pop() : '');

// 6. 假 Payment-Proof 重试 → 走验付(失败)→回退 402（验证回退路径不崩溃）
const fakeProof = Buffer.from(JSON.stringify({ protocol: { payment_proof: 'x', trade_no: 'fake' }, method: {} })).toString('base64')
  .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const t0 = Date.now();
const r3 = await fetch(BASE, {
  method: 'POST',
  headers: headers({ 'Content-Type': 'application/json', 'Payment-Proof': fakeProof }),
  body: JSON.stringify({ asins: ASINS, monthly_credits: 1 }),
});
const h3 = Object.fromEntries(r3.headers.entries());
const dt3 = Date.now() - t0;
step('假凭证重试 → 回退 402', r3.status === 402, `status=${r3.status} hasNewBill=${!!h3['payment-needed']} verifyMs=${dt3}`);

// 7. 再次无头 POST → 仍 402（新账单）
const r4 = await fetch(BASE, {
  method: 'POST',
  headers: headers({ 'Content-Type': 'application/json' }),
  body: JSON.stringify({ asins: ASINS, monthly_credits: 1 }),
});
step('再次无头 POST → 402', r4.status === 402, `status=${r4.status}`);

const passed = results.filter((r) => r.ok).length;
console.log(`\n=== ${passed}/${results.length} 通过 ===`);
process.exit(passed === results.length ? 0 : 1);
