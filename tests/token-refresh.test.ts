import assert from "node:assert/strict";
import test from "node:test";
import { decodeTokenExpiry, isTokenExpiring } from "../src/lib/auth/token-refresh.ts";

const b64 = (o: object) => Buffer.from(JSON.stringify(o)).toString("base64url");
const jwt = (payload: object) => `${b64({ alg: "HS256" })}.${b64(payload)}.sig`;

test("decodes the exp claim of an access token", () => {
  assert.equal(decodeTokenExpiry(jwt({ exp: 1234 })), 1234);
  assert.equal(decodeTokenExpiry("garbage"), null);
  assert.equal(decodeTokenExpiry(null), null);
});

test("flags tokens that expire within the refresh skew", () => {
  const now = Math.floor(Date.now() / 1000);
  assert.equal(isTokenExpiring(jwt({ exp: now + 30 })), true);
  assert.equal(isTokenExpiring(jwt({ exp: now + 3600 })), false);
  assert.equal(isTokenExpiring(jwt({ sub: "legacy-without-exp" })), false);
});
