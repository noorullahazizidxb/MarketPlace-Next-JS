import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import test from "node:test";
import { createShutdown, registerGracefulShutdown, type ShutdownProcess } from "../src/lib/shutdown.ts";

const silent = { info: () => {}, error: () => {} };
const tick = () => new Promise((r) => setTimeout(r, 5));

function fakeProc() {
  const proc = new EventEmitter() as EventEmitter & ShutdownProcess & { exits: number[] };
  proc.exits = [];
  proc.exit = (code?: number) => proc.exits.push(code ?? 0);
  return proc;
}

test("closes the server and runs cleanups once, exit 0, even on repeated signals", async () => {
  const proc = fakeProc();
  let cleanups = 0;
  let closes = 0;
  const server = { close: (cb?: (err?: Error) => void) => { closes += 1; cb?.(); } };
  registerGracefulShutdown({ server, cleanups: [async () => { cleanups += 1; }], logger: silent, proc });
  proc.emit("SIGTERM", "SIGTERM");
  proc.emit("SIGINT", "SIGINT");
  await tick();
  assert.equal(closes, 1);
  assert.equal(cleanups, 1);
  assert.deepEqual(proc.exits, [0, 0]);
});

test("registers only once per process", () => {
  const proc = fakeProc();
  const a = registerGracefulShutdown({ logger: silent, proc });
  const b = registerGracefulShutdown({ logger: silent, proc });
  assert.equal(a, b);
  assert.equal(proc.listenerCount("SIGTERM"), 1);
  a.dispose();
  assert.equal(proc.listenerCount("SIGTERM"), 0);
});

test("returns exit code 1 when cleanup exceeds the timeout", async () => {
  // The shutdown timer is unref'd, so keep the event loop alive like a real server would.
  const keepAlive = setInterval(() => {}, 1000);
  try {
    const shutdown = createShutdown({ cleanups: [() => new Promise(() => {})], timeoutMs: 20, logger: silent });
    assert.equal(await shutdown("SIGTERM"), 1);
  } finally {
    clearInterval(keepAlive);
  }
});

test("keeps running remaining cleanups after a failure and returns 1", async () => {
  let ran = false;
  const shutdown = createShutdown({
    cleanups: [() => Promise.reject(new Error("boom")), () => { ran = true; }],
    logger: silent,
  });
  assert.equal(await shutdown("SIGINT"), 1);
  assert.equal(ran, true);
});

test("with exit:false sets exitCode instead of exiting", async () => {
  const proc = fakeProc();
  registerGracefulShutdown({ exit: false, logger: silent, proc });
  proc.emit("SIGTERM", "SIGTERM");
  await tick();
  assert.deepEqual(proc.exits, []);
  assert.equal(proc.exitCode, 0);
});
