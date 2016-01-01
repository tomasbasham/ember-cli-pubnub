import Ember from 'ember';
import Channel from 'ember-cli-pubnub/channels/channel';

const {
  assert
} = Ember;

/*
 * Create a channel object with a
 * given name. This will be the
 * interface to the PubNub service
 * when interacting with this
 * channel.
 *
 * @method createChannel
 *
 * @param {String} name
 *   The name of the channel.
 *
 * @param {Ember.Service} service
 *   The pubnub service.
 *
 * @return {Ember.Object}
 *   A channel object.
 */
export default function createChannel(name, service) {
  assert('You must give the channel a name', name);

  const channel = Channel.create({
    name: name,
    pubnub: service
  });

  return channel;
}
