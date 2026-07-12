const Module = require('node:module');
const path = require('node:path');

class PluginMock {
  constructor(app = {}, manifest = { id: 'aimeton-cloud-bridge' }) {
    this.app = app;
    this.manifest = manifest;
    this._data = {
      language: 'ru',
      oauthToken: 'mobile-test-token-placeholder',
      rootPath: 'disk:/',
      networkMode: 'manual',
    };
  }
  async loadData() { return this._data; }
  async saveData(value) { this._saved = JSON.parse(JSON.stringify(value)); }
  registerView() {}
  addRibbonIcon() { return { setAttribute() {} }; }
  addCommand(command) { return command; }
  addSettingTab() {}
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
  Platform: { isMobileApp: true },
};

const originalLoad = Module._load;
Module._load = function(request, parent, isMain) {
  if (request === 'obsidian') return obsidianMock;
  return originalLoad.call(this, request, parent, isMain);
};

(async () => {
  try {
    const pluginPath = path.resolve(__dirname, '../src/main.js');
    delete require.cache[pluginPath];
    const PluginClass = require(pluginPath);
    const plugin = new PluginClass({}, { id: 'aimeton-cloud-bridge' });
    await plugin.loadSettings();

    if (!plugin.isMobileRuntime()) throw new Error('Mobile runtime not detected.');
    if (plugin.getEffectiveNetworkMode() !== 'mobile-system') throw new Error('Mobile must use system networking.');
    if (plugin.getHeaders().Authorization !== 'OAuth mobile-test-token-placeholder') throw new Error('Mobile OAuth header failed.');

    console.log('Mobile compatibility smoke test passed.');
  } finally {
    Module._load = originalLoad;
  }
})().catch((error) => {
  console.error(error.stack || error);
  process.exit(1);
});
