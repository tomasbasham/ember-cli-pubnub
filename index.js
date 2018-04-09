'use strict';

const path = require('path');
const Funnel = require('broccoli-funnel');
const mergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: 'ember-cli-pubnub',

  /**
   * Add the PubNub JavaScript package
   * to the consuming application and
   * expose the vendor shim enabling it
   * to be imported as an es6 module.
   *
   * @method included
   *
   * @param {Object} app
   *   An EmberApp instance.
   */
  included: function(app) {
    this._super(app);

    const vendorTree = this.treePaths.vendor;

    // Import the PubNub package and shim.
    app.import(`${vendorTree}/pubnub.js`);
    app.import(`${vendorTree}/shims/pubnub.js`, {
      exports: {
        PubNub: ['default']
      }
    });
  },

  /**
   * Resolve the path to the PubNub web
   * bundle and transpose the files in
   * that path into the project's vendor
   * folder during build time.
   *
   * @method treeForVendor
   *
   * @params {Object} vendorTree
   *   The broccoli tree representing vendor files.
   */
  treeForVendor: function(vendorTree) {
    const pubnubPath = path.dirname(require.resolve('pubnub/dist/web/pubnub.js'));
    const pubnubTree = new Funnel(pubnubPath, {
      src: 'pubnub.js',
      dest: './',
      annotation: 'Funnel (PubNub)'
    });

    return mergeTrees([vendorTree, pubnubTree]);
  }
};
