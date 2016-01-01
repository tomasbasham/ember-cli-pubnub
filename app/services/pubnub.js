import Pubnub from 'ember-cli-pubnub/services/pubnub';
import config from '../config/environment';

export default Pubnub.extend({
  config: config
});
