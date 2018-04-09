import { messageEventString, presenceEventString } from 'ember-cli-pubnub/utils/event-string';
import { module, test } from 'qunit';

module('Unit | Utility | event string');

test('it returns a message event string scoped to a channel', function(assert) {
  let result = messageEventString('enterprise');
  assert.equal('pn-message:enterprise', result);
});

test('it returns a presence event string scoped to a channel', function(assert) {
  let result = presenceEventString('enterprise');
  assert.equal('pn-presence:enterprise', result);
});
