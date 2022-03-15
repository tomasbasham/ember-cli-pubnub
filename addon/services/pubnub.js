import EmberError from '@ember/error';
import PubNub from 'pubnub';
import { get } from '@ember/object';

export default {
  create() {
    const config = get(this, 'config') ?? {};

    if (!config || typeof config.pubnub !== 'object') {
      throw new EmberError('Please set the `pubnub` property in the envrionment config');
    }

    return new PubNub(config.pubnub);
  },

  config: null,
  isServiceFactory: true
};
