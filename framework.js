var webview = require('bbx-emulator/lib/webview');

var _self = {
    startWebview: function (url) {
        webview.create(url);
    },
    stopWebview: function () {
        webview.destroy();
    }
};

module.exports = _self;
