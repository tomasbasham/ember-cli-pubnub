import isValid from 'dummy/utils/is-valid';
import { module, test } from 'qunit';

module('Unit | Utility | is valid');

test('it accepts object types', function(assert) {
  let result = isValid({ captain: 'Jean-Luc Picard' });
  assert.ok(result);
});

test('it accepts string types', function(assert) {
  let result = isValid('Jean-Luc Picard' );
  assert.ok(result);
});

test('it accepts number types', function(assert) {
  let result = isValid(42);
  assert.ok(result);
});

test('it accepts array types', function(assert) {
  let result = isValid([1, 2, 3, 4, 5]);
  assert.ok(result);
});

test('it accepts boolean types', function(assert) {
  let result = isValid(true);
  assert.ok(result);
});

test('it does not parse invalid JSON types', function(assert) {
  let result = isValid(undefined);
  assert.notOk(result);
});
