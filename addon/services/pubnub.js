/* global PUBNUB */

import Ember from 'ember';
import isValid from 'ember-cli-pubnub/utils/is-valid';
import createChannel from 'ember-cli-pubnub/utils/create-channel';

const {
  assert,
  get,
  getWithDefault,
  on,
  set
} = Ember;

export default Ember.Service.extend(Ember.Evented, {

  /*
   * The pubnub client API context.
   *
   * @type {Object}
   */
  pubnub: null,

  /*
   * List of subscribed channels.
   *
   * @type {Array}
   */
  _channels: null,

  /*
   * List of users currently subscribed to
   * each channel.
   *
   * @type {Object}
   */
  _presence: null,

  /*
   * Cached presence data for each channel.
   *
   * @type {Object}
   */
  _presData: null,

  /*
   * Instantiate the pubnub object and
   * configure the pubnub state
   * information.
   *
   * @method configurePubNub
   * @on init
   */
  configurePubNub: on('init', function() {
    const pubnubConfig = get(this, 'config')['pubnub'];

    if (!pubnubConfig) {
      Ember.Error('no configuration provided!');
    }

    const pubnub = PUBNUB.init(pubnubConfig);

    // Initiate state values.
    set(this, '_channels', []);
    set(this, '_presence', {});
    set(this, '_presData', {});

    // Save a reference to the pubnub client API context.
    set(this, 'pubnub', pubnub);
  }),

  /*
   * Reveal existing permission attributes
   * set on a channel.
   *
   * @method audit
   *
   * @param {Object} options
   *   Options to send the audit method.
   */
  audit(options = {}) {
    const { channel, callback } = options;

    assert('Cannot audit an undefined channel', channel);
    assert('Cannot audit a channel without a callback', callback && typeof callback === 'function');

    const pubnub = get(this, 'pubnub');
    pubnub.audit(options);
  },

  /*
   * Set permissions on a channel.
   *
   * @method grant
   *
   * @param {Object} options
   *   Options to send the grant method.
   */
  grant(options) {
    const { channel, callback } = options;

    assert('Cannot grant permissions on an undefined channel', channel);
    assert('Cannot grant permissions on a channel without a callback', callback && typeof callback === 'function');

    const pubnub = get(this, 'pubnub');
    pubnub.grant(options);
  },

  /*
   * Obtain information about the current
   * state of a channel including a list
   * of unique UUIDs currently subscribed
   * to a channel and the total occupancy
   * count.
   *
   * @method hereNow
   *
   * @param {Object} options
   *   Options to send the here_now method.
   */
  hereNow(options = {}) {
    const { channel } = options;

    assert('Cannot get presence information for an undefined channel', channel);

    const handlers = this._installHandlers();

    // Attach attributes to options.
    options.callback = handlers.presence;
    options.state = options.state || true;
    options.uuids = options.uuids || true;

    const pubnub = get(this, 'pubnub');
    pubnub.here_now(options);
  },

  /*
   * Fetch historical messages from a
   * channel. The results of running
   * the history will be returned by
   * the registered event handler for
   * the channel.
   *
   * @method history
   *
   * @param {Object} options
   *   Options to send the history method.
   */
  history(options = {}) {
    const { channel } = options;

    assert('Cannot get history for an undefined channel', channel);

    // Attach attributes to options.
    options.callback = options.callback || this.messageEventHandler(channel);

    const pubnub = get(this, 'pubnub');
    pubnub.history(options);
  },

  /*
   * Publish messages to a channel.
   *
   * @method publish
   *
   * @param {Object} options
   *   Options to send the publish method.
   */
  publish(options = {}) {
    const { channel, message } = options;

    assert('Cannot publish to an undefined channel', channel);
    assert('Cannot publish an invalid message', message && isValid(message));

    const pubnub = get(this, 'pubnub');
    pubnub.publish(options);
  },

  /*
   * Remove any non default permissions
   * from a channel.
   *
   * @method revoke
   *
   * @param {Object} options
   *   Options to send the grant method.
   */
  revoke(options = {}) {
    const { channel } = options;

    assert('Cannot revoke permissions from an undefined channel', channel);

    this.grant(options);
  },

  /*
   * Set the authentication key for
   * the pubnub connection.
   *
   * @method setAuthKey
   *
   * @param {String} key
   *   The new authentication key.
   */
  setAuthKey(key) {
    assert('Cannot set undefined auth key', key);

    const pubnub = get(this, 'pubnub');
    pubnub.auth(key);
  },

  /*
   * Add state information to a channel,
   * and optionally for a particular
   * UUID.
   *
   * @method setState
   *
   * @param {Object} options
   *   Options to send the state method.
   */
  setState(options = {}) {
    const { channel, callback } = options;

    assert('Cannot set state on an undefined channel', channel);
    assert('Cannot set state without a callback', callback && typeof callback === 'function');

    const pubnub = get(this, 'pubnub');
    pubnub.state(options);
  },

  /*
   * Update the UUID of the user. If a
   * UUID is not given then generate a
   * new one before proceeding.
   *
   * @method setUuid
   *
   * @param {String} uuid
   *   The new UUID.
   */
  setUuid(uuid) {
    if (typeof uuid === 'undefined') {
      return this.uuid(this.setUuid);
    }

    const pubnub = get(this, 'pubnub');
    pubnub.set_uuid(uuid);
  },

  /*
   * Grab the current state of a
   * channel, and optionally for a
   * particular UUID.
   *
   * @method state
   *
   * @param {Object} options
   *   Options to send the state method.
   */
  state(options = {}) {
    const { channel, callback } = options;

    assert('Cannot get state on an undefined channel', channel);
    assert('Cannot get state without a callback', callback && typeof callback === 'function');

    this.setState(options);
  },

  /*
   * Subscribe the user to a channel,
   * optionally in a channel group.
   *
   * @method subscribe
   *
   * @param {String} channel
   *   The name of the channel.
   *
   * @param {Object} options
   *   Options to send the subscribe method.
   *
   * @return {Ember.Object}
   *   A channel object.
   */
  subscribe(channel, options = {}) {
    assert('Cannot subscribe to an undefined channel', channel);

    // Return channels that we are already
    // subscribed to.
    const channels = get(this, '_channels');
    if (channels.indexOf(channel) >= 0) {
      return createChannel(channel, this);
    }

    // Attach attributes to options.
    options.channel = channel;

    // Install a series of handlers.
    this._installHandlers(options);

    if (channels.indexOf(channel) < 0) {
      channels.push(channel);
    }

    const presenceData = get(this, '_presData');
    const presence = get(this, '_presence');

    if (typeof presenceData[channel] === 'undefined') {
      presence[channel] = [];
    }

    const pubnub = get(this, 'pubnub');
    pubnub.subscribe(options);

    // Create the interface to use this
    // new channel.
    const newChannel = createChannel(channel, this);
    return newChannel;
  },

  /*
   * Return a 17 digit percision UNIX
   * epoch.
   *
   * @method time
   *
   * @param {Function} callback
   *   Callback method returning the UNIX epoch.
   */
  time(callback) {
    assert('Cannot get time without a callback', callback && typeof callback === 'function');

    const pubnub = get(this, 'pubnub');
    pubnub.time(callback);
  },

  /*
   * Unsubscribe from a channel that is
   * optionally part of a channel group.
   *
   * @method unsubscribe
   *
   * @param {Object} options
   *   Options to send the unsubscribe method.
   */
  unsubscribe(options = {}) {
    const { channel } = options;

    assert('Cannot unsubscribe from an undefined channel', channel);

    // Remove the channel from the list
    // of stored channels and delete it
    // from memory.
    const channels = get(this, '_channels');
    const cpos = channels.indexOf(channel);

    if (cpos !== -1) {
      channels.splice(cpos, 1);
    }

    const presence = get(this, '_presence');
    presence[channel] = null;

    this.off(this.messageEventString(channel));
    this.off(this.presenceEventString(channel));

    const pubnub = get(this, 'pubnub');
    pubnub.unsubscribe(options);
  },

  /*
   * Generate a new universally unique
   * identifier to be used for various
   * pubnub objects (users, channels,
   * etc...).
   *
   * @method uuid
   *
   * @param {Function} callback
   *   Callback method returning the new UUID.
   */
  uuid(callback) {
    assert('Cannot get uuid without a callback', callback && typeof callback === 'function');

    const pubnub = get(this, 'pubnub');
    pubnub.uuid(callback);
  },

  /*
   * Return a list of channels the user
   * is subscribed to.
   *
   * @method whereNow
   *
   * @param {Object} options
   *   Options to send the where_now method.
   *
   * @param {Function}
   *   Callback method returning the list of subscribed channels.
   */
  whereNow(options = {}) {
    const { callback } = options;

    assert('Cannot get subscribed channels without a callback', callback && typeof callback === 'function');

    const pubnub = get(this, 'pubnub');
    pubnub.where_now(options);
  },

  /*
   * Return the UUID of the current user.
   *
   * @method me
   *
   * @return {String}
   *   The UUID of the current user.
   */
  me() {
    const pubnub = get(this, 'pubnub');
    return pubnub.get_uuid();
  },

  /*
   * List all subscribed channels.
   *
   * @method listChannels
   *
   * @return {Array}
   *   List of channels.
   */
  listChannels() {
    return get(this, '_channels');
  },

  /*
   * List all users in a channel.
   *
   * @method listPresence
   *
   * @param {String} channel
   *   The name of the channel.
   *
   * @return {Array}
   *   List of users.
   */
  listPresence(channel) {
    return getWithDefault(this, `_presence.${channel}`, Ember.A());
  },

  /*
   * Extract cached presence data from
   * this service for a channel.
   *
   * @method presenceData
   *
   * @param {String} channel
   *   The name of the channel.
   *
   * @return {Object}
   *   Presence data for a channel.
   */
  presenceData(channel) {
    return getWithDefault(this, `_presData.${channel}`, Ember.A());
  },

  /*
   * Build a closure responsible for
   * triggering a series of messages
   * for a channel. This is most useful
   * when listing historical messages.
   *
   * @method messageEventHandler
   *
   * @param {String} channel
   *   The name of the channel.
   *
   * @return {Function}
   *   Scoped method that can be used to trigger a series of messages.
   */
  messageEventHandler(channel) {
    const pubnub = get(this, 'pubnub');
    return (messages) => {
      const messageEventString = this.messageEventString(channel);
      return pubnub.each(messages[0], (message) => {
        return this.trigger(messageEventString, { message, channel });
      });
    };
  },

  /*
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
  messageEventString(channel) {
    return `pn-message:${channel}`;
  },

  /*
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
  presenceEventString(channel) {
    return `pn-presence:${channel}`;
  },

  /*
   * Install event handlers for a channel.
   *
   * @method installHandlers
   * @private
   *
   * @params {Object} args
   *   Object to install the event handlers.
   */
  _installHandlers(args = {}) {
    const pubnub = get(this, 'pubnub');
    const presence = get(this, '_presence');
    const presenceData = get(this, '_presData');
    const self = this;

    const oldMessage = args.message;
    args.message = function() {
      self.trigger(self.messageEventString(args.channel), {
        message: arguments[0],
        env: arguments[1],
        channel: args.channel
      });

      if (oldMessage) {
        return oldMessage(arguments);
      }
    };

    args.presence = function() {
      const event = arguments[0];
      const channel = args.channel;

      if (event.uuids) {
        pubnub.each(event.uuids, function(uuid) {
          const state = uuid.state ? uuid.state : null;
          uuid = uuid.uuid ? uuid.uuid : uuid;

          if (typeof presence[channel] === 'undefined') {
            presence[channel] = [];
          }

          if (presence[channel].indexOf(uuid) < 0) {
            presence[channel].push(uuid);
          }

          if (typeof presenceData[channel] === 'undefined') {
            presenceData[channel] = {};
          }

          if (state) {
            return presenceData[channel][uuid] = state;
          }
        });
      } else {
        if (event.uuid && event.action) {
          if (typeof presence[channel] === 'undefined') {
            presence[channel] = [];
          }

          if (typeof presenceData[channel] === 'undefined') {
            presenceData[channel] = {};
          }

          if (event.action === 'leave') {
            const cpos = presence[channel].indexOf(event.uuid);
            if (cpos !== -1) {
              presence[channel].splice(cpos, 1);
            }

            delete presenceData[channel][event.uuid];
          } else {
            if (presence[channel].indexOf(event.uuid) < 0) {
              presence[channel].push(event.uuid);
            }

            if (event.data) {
              presenceData[channel][event.uuid] = event.data;
            }
          }
        }
      }

      return self.trigger(self.presenceEventString(channel), {
        event: event,
        message: arguments[1],
        channel: channel
      });
    };

    return args;
  }
});
