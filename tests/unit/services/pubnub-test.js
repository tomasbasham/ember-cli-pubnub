import { moduleFor, test } from 'ember-qunit';

moduleFor('service:pubnub', 'Unit | Service | pubnub', {
  // Specify the other units that are required for this test.
  // needs: ['service:foo']
});

test('it creates a PubNub object', function(assert) {
  let service = this.subject();
  assert.ok(service);
});
