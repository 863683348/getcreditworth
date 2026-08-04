import fs from 'node:fs';
import path from 'node:path';

const TOKEN = process.env.GH_TOKEN;
const OWNER = '863683348';
const REPO = 'getcreditworth';
const BASE = 'C:\\Users\\l\'x\\WorkBuddy\\2026-08-04-13-14-21\\getcreditworth';

const api = (method, p, body) =>
  fetch(`https://api.github.com${p}`, {
    method,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'workbuddy-push',
      'Content-Type': 'application/json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: body ? JSON.stringify(body) : undefined,
  }).then(async (r) => {
    const text = await r.text();
    if (!r.ok) throw new Error(`GitHub API ${method} ${p} -> ${r.status}: ${text.slice(0, 400)}`);
    return text ? JSON.parse(text) : {};
  });

const SKIP_DIRS = new Set(['node_modules', '.next', '.git', '.vercel', 'out', '.cache']);

function walk(dir, rel, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    const r = rel ? `${rel}/${e.name}` : e.name;
    if (e.isDirectory()) {
      if (SKIP_DIRS.has(e.name)) continue;
      walk(full, r, out);
    } else {
      if (e.name === '.DS_Store' || e.name === 'Thumbs.db') continue;
      if (e.name.endsWith('.tsbuildinfo')) continue;
      out.push(r);
    }
  }
  return out;
}

const files = walk(BASE, '');
console.log(`[1] 待同步文件数: ${files.length}`);

// 获取当前默认分支最新 commit（作为基树）
const head = await api('GET', `/repos/${OWNER}/${REPO}/git/ref/heads/main`).catch(async () => {
  return await api('GET', `/repos/${OWNER}/${REPO}/git/ref/heads/master`);
});
const baseSha = head.object.sha;
console.log(`[2] 基树 commit: ${baseSha.slice(0, 12)}`);

// 创建 blobs
const blobs = {};
for (const f of files) {
  const content = fs.readFileSync(path.join(BASE, f));
  const b = await api('POST', `/repos/${OWNER}/${REPO}/git/blobs`, {
    content: content.toString('base64'),
    encoding: 'base64',
  });
  blobs[f] = b.sha;
}
console.log(`[3] blobs 创建完成 (${Object.keys(blobs).length})`);

// 构建树
const treeItems = files.map((f) => ({
  path: f,
  mode: '100644',
  type: 'blob',
  sha: blobs[f],
}));
const tree = await api('POST', `/repos/${OWNER}/${REPO}/git/trees`, {
  base_tree: baseSha,
  tree: treeItems,
});
console.log(`[4] tree: ${tree.sha.slice(0, 12)}`);

const message = process.env.COMMIT_MSG || 'chore: sync site files';
const commit = await api('POST', `/repos/${OWNER}/${REPO}/git/commits`, {
  message,
  tree: tree.sha,
  parents: [baseSha],
});
console.log(`[5] commit: ${commit.sha.slice(0, 12)}`);

await api('PATCH', `/repos/${OWNER}/${REPO}/git/refs/heads/${head.ref.replace('refs/heads/', '')}`, {
  sha: commit.sha,
  force: false,
});
console.log(`[6] 推送完成 -> ${head.ref}`);
console.log(`同步文件数: ${files.length} | commit: ${commit.sha}`);
