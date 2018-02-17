(function() {
  function vendorModule() {
    'use strict';

    return {
      'default': self['PubNub'],
      __esModule: true
    };
  }

  define('pubnub', [], vendorModule);
})();
