/**
 * AWS Signature Version 4 签名工具
 * 用于 PA-API 5.0 请求认证
 *
 * 参考实现: https://docs.aws.amazon.com/general/latest/gr/sigv4_signing.html
 */

import { createHash, createHmac } from "node:crypto";

interface SigningOptions {
  method: string;
  host: string;
  path: string;
  body: string;
  service: string;
  region: string;
  accessKey: string;
  secretKey: string;
}

interface SignedHeaders {
  authorization: string;
  "x-amz-date": string;
  "content-type": string;
}

/**
 * 生成 AWS SigV4 签名头
 */
export function signRequest(opts: SigningOptions): SignedHeaders {
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]/g, "").substring(0, 17) + "Z";
  const dateStamp = amzDate.substring(0, 8);

  const bodyHash = sha256Hex(opts.body);

  const canonicalHeaders = [
    "content-type:" + "application/json; charset=UTF-8",
    "host:" + opts.host,
    "x-amz-date:" + amzDate,
  ].join("\n");

  const signedHeadersList = "content-type;host;x-amz-date";

  const canonicalRequest = [
    opts.method,
    opts.path,
    "",
    canonicalHeaders,
    "",
    signedHeadersList,
    bodyHash,
  ].join("\n");

  const algorithm = "AWS4-HMAC-SHA256";
  const credentialScope = [
    dateStamp,
    opts.region,
    opts.service,
    "aws4_request",
  ].join("/");

  const stringToSign = [
    algorithm,
    amzDate,
    credentialScope,
    sha256Hex(canonicalRequest),
  ].join("\n");

  const signingKey = getSignatureKey(
    opts.secretKey,
    dateStamp,
    opts.region,
    opts.service,
  );
  const signature = hmacHex(signingKey, stringToSign);

  const authorization = [
    algorithm + " ",
    "Credential=" + opts.accessKey + "/" + credentialScope + ", ",
    "SignedHeaders=" + signedHeadersList + ", ",
    "Signature=" + signature,
  ].join("");

  return {
    authorization,
    "x-amz-date": amzDate,
    "content-type": "application/json; charset=UTF-8",
  };
}

function sha256Hex(data: string): string {
  return createHash("sha256").update(data, "utf8").digest("hex");
}

function hmacHex(key: Buffer, data: string): string {
  return createHmac("sha256", key).update(data, "utf8").digest("hex");
}

function getSignatureKey(
  key: string,
  dateStamp: string,
  regionName: string,
  serviceName: string,
): Buffer {
  const kDate = hmacRaw("AWS4" + key, dateStamp);
  const kRegion = hmacRaw(kDate, regionName);
  const kService = hmacRaw(kRegion, serviceName);
  const kSigning = hmacRaw(kService, "aws4_request");
  return kSigning;
}

function hmacRaw(key: string | Buffer, data: string): Buffer {
  return createHmac("sha256", key).update(data, "utf8").digest();
}
