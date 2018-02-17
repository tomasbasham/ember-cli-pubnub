import EmberObject from '@ember/object';

import { get } from '@ember/object';

export default EmberObject.extend({

  /*
   * Name given to this channel. This will
   * be used to subsequently call every
   * pubnub service method to identify from
   * which channel the call originated.
   *
   * @type {String}
   */
  name: null,

  /*
   * The pubnub service. This cannot be
   * injected like in other ember objects
   * because the basic Ember.Object is
   * not created by the container.
   *
   * @type {Ember.Service}
   */
  pubnub: null,

  /*
   * Reveal existing permission attributes
   * set on this channel.
   *
   * @method audit
   *
   * @param {Object} options
   *   Options to send the audit method.
   *
   * @param {Function} callback
   *   Callback method returning permission set on this channel.
   */
  audit(options, callback) {
    const channel = get(this, 'name');
    const pubnub = get(this, 'pubnub');

    // Ensure arguments are in the correct place.
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    // Attach attributes to options.
    options = options || {};
    options.channel = channel;
    options.callback = options.callback || callback;

    pubnub.audit(options);
  },

  /*
   * Set permissions on this channel.
   *
   * @method grant
   *
   * @param {Object} options
   *   Options to send the grant method.
   *
   * @param {Function} callback
   *   Callback method returning permissions set on a channel.
   */
  grant(options, callback) {
    const channel = get(this, 'name');
    const pubnub = get(this, 'pubnub');

    // Ensure arguments are in the correct place.
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    // Attach attributes to options.
    options = options || {};
    options.channel = channel;
    options.callback = options.callback || callback;

    pubnub.grant(options);
  },

  /*
   * Obtain information about the current
   * state of this channel including a
   * list of unique UUIDs currently
   * subscribed to the channel and the
   * total occupancy count.
   *
   * @method hereNow
   *
   * @param {Object} options
   *   Options to send the here_now method.
   *
   * @return {Array}
   *   A list of users on this channel.
   */
  hereNow(options = {}) {
    const channel = get(this, 'name');
    const pubnub = get(this, 'pubnub');

    const presence = pubnub.listPresence(channel);

    // Attach attributes to options.
    options.channel = channel;

    if (!presence) {
      return pubnub.hereNow(options);
    }

    return presence;
  },

  /*
   * Fetch historical messages from this
   * channel. The results of running the
   * history will be returned by the
   * registered event handler for this
   * channel.
   *
   * @method history
   *
   * @param {Object} options
   *   Options to send the history method.
   */
  history(options = {}) {
    const channel = get(this, 'name');
    const pubnub = get(this, 'pubnub');

    // Attach attributes to options.
    options.channel = channel;

    pubnub.history(options);
  },

  /*
   * Attach a callback to a specific
   * channel event.
   *
   * @method on
   *
   * @param {String} event
   *   The event name or a function that will return an event string.
   *
   * @param {Function} callback
   *   A function that will be fired on the event.
   */
  on(event, callback) {
    const channel = get(this, 'name');
    const pubnub = get(this, 'pubnub');

    // Grab an event string if the event
    // is a function.
    if (typeof event === 'function') {
      event = event.call(this, channel);
    }

    pubnub.on(event, callback);
  },

  /*
   * Publish messages to this channel.
   *
   * @method publish
   *
   * @param {Object} options
   *   Options to send the publish method.
   *
   * @param {Function} callback
   *   Callback method returning the successfully published message.
   */
  publish(options, callback) {
    const channel = get(this, 'name');
    const pubnub = get(this, 'pubnub');

    // Ensure arguments are in the correct place.
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    // Attach attributes to options.
    options = options || {};
    options.channel = channel;
    options.callback = options.callback || callback;

    pubnub.publish(options);
  },

  /*
   * Remove any permssions that have been
   * granted on this channel.
   *
   * This method is basically an alias
   * for grant and therefore should be
   * used in the same way.
   *
   * @method revoke
   *
   * @param {Object} options
   *   Options to send the grant method.
   *
   * @param {Function} callback
   *   Callback method returning permissions set on this channel.
   */
  revoke(options, callback) {
    const channel = get(this, 'name');
    const pubnub = get(this, 'pubnub');

    // Ensure arguments are in the correct place.
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    // Attach attributes to options.
    options = options || {};
    options.channel = channel;
    options.callback = options.callback || callback;

    pubnub.revoke(options);
  },

  /*
   * Add state information to this
   * channel, and optionally for a
   * particular UUID.
   *
   * @method setState
   *
   * @param {Object} options
   *   Options to send the state method.
   *
   * @param {Function} callback
   *   Callback method returning the state of this channel.
   */
  setState(options, callback) {
    const channel = get(this, 'name');
    const pubnub = get(this, 'pubnub');

    // Ensure arguments are in the correct place.
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    // Attach attributes to options.
    options = options || {};
    options.channel = channel;
    options.callback = options.callback || callback;

    pubnub.setState(options);
  },

  /*
   * Grab the current state of this
   * channel, and optionally for a
   * particular UUID.
   *
   * @method state
   *
   * @param {Object} options
   *   Options to send the state method.
   *
   * @param {Function} callback
   *   Callback method returning the state of this channel.
   */
  state(options, callback) {
    const channel = get(this, 'name');
    const pubnub = get(this, 'pubnub');

    // Ensure arguments are in the correct place.
    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    // Attach attributes to options.
    options = options || {};
    options.channel = channel;
    options.callback = options.callback || callback;

    pubnub.state(options);
  },

  /*
   * Unsubscribe from this channel,
   * removing presence data.
   *
   * @param {Object} options
   *   Options to send the unsubscribe method.
   *
   * @method unsubscribe
   */
  unsubscribe(options = {}) {
    const channel = get(this, 'name');
    const pubnub = get(this, 'pubnub');

    // Attach attributes to options.
    options.channel = channel;

    pubnub.unsubscribe(options);
  }
});
