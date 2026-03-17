// NOTE: This file simply forwards to next.config.mjs. Keep until all environments reliably load the ESM config.
// This ensures image remotePatterns (including 192.168.11.205:3002) are always applied.
// If you modify config, do it in next.config.mjs only.
//
// Use a dynamic import and export a promise so CommonJS consumers (Next) don't try to require() an ESM module
// which would raise ERR_REQUIRE_ESM. Next supports async config objects (module.exports can be a Promise).
module.exports = (async () => {
	const esmConfig = await import('./next.config.mjs');
	return esmConfig.default || esmConfig;
})();
