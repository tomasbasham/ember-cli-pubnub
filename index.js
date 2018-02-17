'use strict';

const path = require('path');
const Funnel = require('broccoli-funnel');
const mergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: 'ember-cli-pubnub',

  included: function(app) {
    this._super(app);

    const vendor = this.treePaths.vendor;

    app.import(`${vendor}/pubnub.js`);
    app.import(`${vendor}/shims/pubnub.js`, {
      exports: {
        PubNub: ['default']
      }
    });
  },

  treeForVendor: function(vendorTree) {
    const modulePath = path.dirname(require.resolve('pubnub/dist/web/pubnub.js'));
    const pubnubTree = new Funnel(modulePath, {
      files: ['pubnub.js']
    });

    return mergeTrees([vendorTree, pubnubTree]);
  }
};
