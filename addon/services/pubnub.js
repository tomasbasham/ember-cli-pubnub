import EmberError from '@ember/error';
import PubNub from 'pubnub';

import { getWithDefault } from '@ember/object';

export default {
  create() {
    const config = getWithDefault(this, 'config', {});

    if (!config || typeof config.pubnub !== 'object') {
      throw new EmberError('Please set the `pubnub` property in the envrionment config');
    }

    return new PubNub(config.pubnub);
  },

  config: null,
  isServiceFactory: true
};
