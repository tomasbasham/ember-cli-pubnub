import { assert } from '@ember/debug';

/**
 * Message event string. Use this to seed
 * the pubnub event handlers.
 *
 * @method messageEventString
 *
 * @param {String} channel
 *   The name of the channel.
 *
 * @return {String}
 *   Message event string.
 */
export function messageEventString(channel) {
  assert('channel required for message event', channel);
  return `pn-message:${channel}`;
}

/**
 * Presence event string. Use this to seed
 * the pubnub event handlers.
 *
 * @method presenceEventString
 *
 * @param {String} channel
 *   The name of the channel.
 *
 * @return {String}
 *   Presence event string.
 */
export function presenceEventString(channel) {
  assert('channel required for presence event', channel);
  return `pn-presence:${channel}`;
}
