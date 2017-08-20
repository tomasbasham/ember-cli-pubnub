# Ember-cli-pubnub [![Build Status](https://travis-ci.org/tomasbasham/ember-cli-pubnub.svg?branch=master)](https://travis-ci.org/tomasbasham/ember-cli-pubnub)

An [Ember CLI](https://ember-cli.com/) addon to integrate the PubNub low-latency, realtime messaging platform.

PubNub utilises a publish/subscribe model functioning within a quarter of a second to give the user a sense of immediate or current updates to application data making it ideal for chat or any other application requiring transient data.

This addon allows ember to establish and maintain persistent web socket connections to the [PubNub](https://www.pubnub.com/) service and synchronises messages being sent to and from remote peers.

## Installation

From within your Ember CLI project directory run:
```
ember install ember-cli-pubnub
```

## Usage

This addon implements all of the functions listed under the [JavaScript API reference for realtime apps](https://www.pubnub.com/docs/web-javascript/api-reference) as part of the `pubnub` service.

### Configuration

Before the `pubnub` service can be used it first must be configured through `config/environment`. Here you must supply both your PubNub subscribe and publish API keys.

##### <a name="configuration-example"></a>Example:

```JavaScript
// config/environment.js
module.exports = function(environment) {
  var ENV = {
    pubnub: {
      subscribe_key: 'sub-c-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
      publish_key: 'pub-c-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
      ssl: true
    }
  };

  return ENV;
};
```

Optionally you may specify whether the PubNub JavaScript library is fetched over HTTPS using the `ssl` key. Although optional, it is recommended that you set this to `true` within a production environment.

### Injection

This addon makes no assumptions about what ember objects you want to make the `pubnub` service available. Therefore in order to make the service available you need to implement you own injections.

##### <a name="injection-initializer-example"></a>Example:

```JavaScript
// app/initializers/pubnub.js
export function initialize(application) {
  application.inject('controller', 'pubnub', 'service:pubnub');
  application.inject('route', 'pubnub', 'service:pubnub');
};

export default {
  name: 'pubnub',
  initialize: initialize
};
```

This will make the `pubnub` service available to all controllers and routes. It is however unlikely that you will require the service to be injected into every controller or route of your applications. Therefore it is recommended that you include the service on a per object basis.

##### <a name="injection-controller-example"></a>Example:

```JavaScript
// app/controllers/application.js
import Ember from 'ember';

export default Ember.Controller.extend({
  pubnub: Ember.inject.service()
});
```

This will create a dependency on the application controller and inject the `pubnub` service into this controller only. This can be repeated across all objects that need access to the service.

### Subscribe

In order to receive messages you must first subscribe to a channel. Only a channel name is required to subscribe to a channel and must be unique. Other optional parameters can be passed into the subscribe function as key/value pairs and are defined within the API reference on the PubNub website.

##### <a name="subscribe-example"></a>Example:

```JavaScript
// app/controllers/application.js
import Ember from 'ember';

export default Ember.Controller.extend({
  joinChannel: Ember.on('init', function() {
    const pubnub = this.get('pubnub');
    const channel = pubnub.subscribe('lobby');
  })
});
```

This will subscribe to the `lobby` channel and return a channel object that will be the interface to this channel.

### Channel

A channel object is a proxy, passing the channel name to each of the implemented functions that interact with the PubNub service. To be able to react to an incoming message you must provide a callback function that will be passed any message that is received on the channel from any connected peer.

##### <a name="event-example"></a>Example:

```JavaScript
// app/controllers/application.js
import Ember from 'ember';

export default Ember.Controller.extend({
  joinChannel: Ember.on('init', function() {
    const pubnub = this.get('pubnub');
    const channel = pubnub.subscribe('lobby');

    channel.on(pubnub.messageEventString, function(payload) {
      console.log(payload.message);
    });

    channel.publish({ message: 'hello, world!' });
  })
});
```

This sets up a callback using the channel's `on` method by passing to it a message event string. Typically the event string will be of type string (i.e. `pn-message:lobby`) however if a function is passed instead (i.e. `pubnub.messageEventString`) it will be called passing to it the channel name. This gives you the opportunity to dynamically create event strings. In the above example the event string function in fact simply returns `pn-message:lobby`.

Further to this you are able to publish to the channel using the `publish` function. You may pass to this any valid JSON object including objects, arrays, strings, numbers and booleans.

### Presence

You may also supply a callback that is invoked on updates to a channel's listeners.

##### <a name="event-example"></a>Example:

```JavaScript
// app/controllers/application.js
import Ember from 'ember';

export default Ember.Controller.extend({
  joinChannel: Ember.on('init', function() {
    const pubnub = this.get('pubnub');
    const channel = pubnub.subscribe('lobby');

    channel.on(pubnub.presenceEventString, function(payload) {
      console.log(payload.event);
    });
  })
});
```

This sets up a callback using the channel's `on` method by passing to it a presence event string. Typically the event string will be of type string (i.e. `pn-presence:lobby`) however if a function is passed instead (i.e. `pubnub.presenceEventString`) it will be called passing to it the channel name. This gives you the opportunity to dynamically create event strings. In the above example the event string function in fact simply returns `pn-presence:lobby`.

## Development

### Installation

* `git clone <repository-url>` this repository
* `cd ember-cli-pubnub`
* `npm install`
* `bower install`

### Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

### Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).
