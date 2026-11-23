import assert from "node:assert/strict";
import test from "node:test";
import { isAllowedRecaptchaHostname } from "../src/lib/recaptcha-hostname.ts";

const production = { allowLocal: false };

test("allows apex, www, and subdomains of devminds.net", () => {
  assert.equal(isAllowedRecaptchaHostname("devminds.net", production), true);
  assert.equal(isAllowedRecaptchaHostname("www.devminds.net", production), true);
  assert.equal(isAllowedRecaptchaHostname("marketplace.devminds.net", production), true);
  assert.equal(isAllowedRecaptchaHostname("WWW.DEVMINDS.NET.", production), true);
  assert.equal(isAllowedRecaptchaHostname("a.b.devminds.net", production), true);
});

test("rejects lookalike hosts and empty values", () => {
  assert.equal(isAllowedRecaptchaHostname("evildminds.net", production), false);
  assert.equal(isAllowedRecaptchaHostname("devminds.net.evil.com", production), false);
  assert.equal(isAllowedRecaptchaHostname("marketplace.devminds.net.attacker.com", production), false);
  assert.equal(isAllowedRecaptchaHostname("notdevminds.net", production), false);
  assert.equal(isAllowedRecaptchaHostname("", production), false);
  assert.equal(isAllowedRecaptchaHostname(null, production), false);
  assert.equal(isAllowedRecaptchaHostname("localhost", production), false);
});

test("allows loopback only when local hosts are enabled", () => {
  assert.equal(isAllowedRecaptchaHostname("localhost", { allowLocal: true }), true);
  assert.equal(isAllowedRecaptchaHostname("127.0.0.1", { allowLocal: true }), true);
  assert.equal(isAllowedRecaptchaHostname("[::1]", { allowLocal: true }), true);
});
