/* jshint node: true */
'use strict';

module.exports = {
  name: 'ember-cli-pubnub',

  /*
   * Add the pubnub javascript package
   * to the consuming application for
   * convenience. Now the developer
   * can use pubnub without importing
   * it themselves.
   *
   * @method included
   *
   * @param {Object} app
   *   An EmberApp instance.
   */
  included: function(app) {
    this.app = app;

    // Add the pubnub package to the consuming application.
    app.import('bower_components/pubnub/web/pubnub.js');
  }
};
