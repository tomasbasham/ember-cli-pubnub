import Ember from 'ember';
import createChannel from '../../../utils/create-channel';
import { module, test } from 'qunit';

module('Unit | Utility | create channel');

test('it creates a channel', function(assert) {
  let result = createChannel('enterprise');
  assert.ok(result);
});

test('it throws an exception if a name is not present', function(assert) {
  assert.throws(createChannel, Ember.Error, 'You must give the channel a name');
});
