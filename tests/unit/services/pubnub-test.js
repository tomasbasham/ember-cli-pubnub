import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | pubnub', function(hooks) {
  setupTest(hooks);

  test('it creates a PubNub object', function(assert) {
    let service = this.owner.lookup('service:pubnub');
    assert.ok(service);
  });
});
