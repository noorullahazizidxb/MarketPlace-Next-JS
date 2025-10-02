// NOTE: This file simply forwards to next.config.mjs. Keep until all environments reliably load the ESM config.
// This ensures image remotePatterns (including 192.168.11.205:3002) are always applied.
// If you modify config, do it in next.config.mjs only.
const esmConfig = require('./next.config.mjs');
module.exports = esmConfig.default || esmConfig;
