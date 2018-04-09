import PubNub from 'ember-cli-pubnub/services/pubnub';
import config from '../config/environment';

export default Object.assign({}, PubNub, {
  config
});
