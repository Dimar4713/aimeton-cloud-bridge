const Module = require('node:module');
const path = require('node:path');

class PluginMock {
  constructor(app = {}, manifest = { id: 'aimeton-cloud-bridge' }) {
    this.app = app;
    this.manifest = manifest;
    this._data = {
      language: 'en',
      oauthToken: 'test-token-placeholder',
      rootPath: 'disk:/Documents',
      useProxy: true,
      proxyType: 'socks5',
      proxyHost: '127.0.0.1',
      proxyPort: 1080,
      proxyAuth: true,
      proxyUsername: 'tester',
      proxyPassword: 'test-password-placeholder',
    };
  }
  async loadData() { return this._data; }
  async saveData(value) { this._saved = JSON.parse(JSON.stringify(value)); }
}
class EmptyClass {}

const obsidianMock = {
  Plugin: PluginMock,
  PluginSettingTab: EmptyClass,
  Setting: EmptyClass,
  Notice: EmptyClass,
  TFile: EmptyClass,
  Modal: EmptyClass,
  ItemView: EmptyClass,
  normalizePath: (value) => value.replace(/\\/g, '/'),
  requestUrl: async () => ({ status: 200, headers: {}, json: {}, arrayBuffer: new ArrayBuffer(0) }),
  Platform: { isMobileApp: false },
};

const originalLoad = Module._load;
Module._load = function(request, parent, isMain) {
  if (request === 'obsidian') return obsidianMock;
  return originalLoad.call(this, request, parent, isMain);
};

(async () => {
  try {
    const PluginClass = require(path.resolve(__dirname, '../src/main.js'));
    const plugin = new PluginClass({}, { id: 'aimeton-cloud-bridge' });
    await plugin.loadSettings();

    if (plugin.settings.language !== 'en') throw new Error('Language migration failed.');
    if (plugin.settings.rootPath !== 'disk:/Documents') throw new Error('Root path loading failed.');
    if (plugin.settings.networkMode !== 'manual') throw new Error('Legacy useProxy migration failed.');
    if (plugin.getHeaders().Authorization !== 'OAuth test-token-placeholder') throw new Error('OAuth header failed.');
    const proxy = plugin.getProxyConfig();
    if (proxy.type !== 'socks5' || proxy.port !== 1080 || proxy.password !== 'test-password-placeholder') {
      throw new Error('Proxy settings loading failed.');
    }

    console.log('Desktop settings smoke test passed.');
  } finally {
    Module._load = originalLoad;
  }
})().catch((error) => {
  console.error(error.stack || error);
  process.exit(1);
});
