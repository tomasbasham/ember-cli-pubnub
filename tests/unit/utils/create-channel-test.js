import EmberError from '@ember/error';

import createChannel from 'dummy/utils/create-channel';

import { module, test } from 'qunit';

module('Unit | Utility | create channel');

test('it creates a channel', function(assert) {
  let result = createChannel('enterprise');
  assert.ok(result);
});

test('it throws an exception if a name is not present', function(assert) {
  assert.throws(createChannel, EmberError, 'You must give the channel a name');
});
