/*
 * Determine the validity of a
 * JSON type.
 *
 * @method isValid
 *
 * @param {Object} value
 *   Any valid JSON type including objects, arrays, strings, numbers, booleans and null.
 *
 * @return {Boolean}
 *   True if JSON is valid, otherwise false.
 */
export default function isValid(value) {
  const valueType = typeof value;
  const validTypes = ['object', 'string', 'number', 'boolean'];

  if (validTypes.includes(valueType)) {
    return true;
  }

  return false;
}
