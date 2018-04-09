# ember-cli-pubnub [![Build Status](https://travis-ci.org/tomasbasham/ember-cli-pubnub.svg?branch=master)](https://travis-ci.org/tomasbasham/ember-cli-pubnub)

An [Ember CLI](https://ember-cli.com/) addon to integrate the PubNub
low-latency, realtime messaging platform.

PubNub utilises a publish/subscribe model functioning within a quarter of a
second to give the user a sense of immediate or current updates to application
data making it ideal for chat or any other application requiring transient
data.

This addon allows ember to establish and maintain persistent web socket
connections to the [PubNub](https://www.pubnub.com/) service and synchronises
messages being sent to and from remote peers.

## Installation

From within your Ember CLI project directory run:
```
ember install ember-cli-pubnub
```

## Usage

This addon implements a shim for the PubNub V4 JavaScript library that can be
imported as an es6 module. The library is initialised with a `pubnub` service
that should be used to make requests to the PubNub backend.

### Configuration

Before the `pubnub` service can be used it first must be configured through
`config/environment`. Here you must supply both your PubNub subscribe and
publish API keys.

##### Configuration Example

```JavaScript
// config/environment.js
module.exports = function(environment) {
  var ENV = {
    pubnub: {
      subscribeKey: 'sub-c-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
      publishKey: 'pub-c-XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX',
      ssl: true
    }
  };

  return ENV;
};
```

Optionally you may specify whether the PubNub JavaScript library is fetched
over HTTPS using the `ssl` key. Although optional, it is recommended that you
set this to `true` within a production environment.

### Injection

This addon makes no assumptions about what ember objects you want to make the
`pubnub` service available. Therefore in order to make the service available
you need to implement you own injections.

##### Injection Initializer Example

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

This will make the `pubnub` service available to all controllers and routes. It
is however unlikely that you will require the service to be injected into every
controller or route of your applications. Therefore it is recommended that you
include the service on a per object basis.

##### Injection Controller Example

```JavaScript
// app/controllers/application.js
import Controller from '@ember/controller';
import { inject } from '@ember/service';

export default Controller.extend({
  pubnub: inject()
});
```

This will create a dependency on the application controller and inject the
`pubnub` service into this controller only. This can be repeated across all
objects that need access to the service.

### Subscribe

In order to receive messages published to a channel use the `subscribe`
function passing the required unique channel name. Other optional parameters
can be passed into the subscribe function as key/value pairs and are defined
within the API reference on the PubNub website.

##### Subscribe Example

```JavaScript
// app/controllers/application.js
import Controller from '@ember/controller';

import { get } from '@ember/object';
import { on } from '@ember/object/evented';
import { inject } from '@ember/service';

export default Controller.extend({
  pubnub: inject(),

  joinChannel: on('init', function() {
    const pubnub = get(this, 'pubnub');

    pubnub.subscribe({
      channels: ['lobby'],
      withPresence: true
    });
  })
});
```

This will subscribe the client  to the `lobby` channel and additionally
subscribe to the presence channel instance conventionally named `lobby-pnpres`.

### Publish

In order to publish messages to a channel that a client has previously
subscribed use the `publish` function passing both the required channel name
and message. Other optional parameters can be passed into the `publish`
function as key/value pairs and are defined within the API reference on the
PubNub website.

##### Publish Example

```JavaScript
// app/controllers/application.js
import Controller from '@ember/controller';

import { get } from '@ember/object';
import { inject } from '@ember/service';

export default Controller.extend({
  pubnub: inject(),

  actions: {
    publish(message) {
      const pubnub = get(this, 'pubnub');

      pubnub.publish({
        channel: 'lobby',
        message: 'Hello, World'
      });
    }
  }
});
```

This will publish the message `Hello, World` to the `lobby` channel. All client
that have subscribed to this channel will receive this message.

### Advanced Setup

Previous examples demonstrate how to subscribe to a channel and subsequently
publish a message to the same channel. However there is no guarantee that a
client will only publish messages after it has successfully subscribed to a
channel. Therefore a client may not receive all of it's own messages.

To ensure the client only publishes messages after it has subscribed to a
channel use the `addListener` function. This allows callbacks for channel
status changes that receives events when a client has subscribed to a channel.

##### Advanced Example

```JavaScript
// app/controllers/application.js
import Controller from '@ember/controller';

import { get } from '@ember/object';
import { on } from '@ember/object/evented';
import { inject } from '@ember/service';

export default Controller.extend({
  pubnub: inject(),

  joinChannel: on('init', function() {
    const pubnub = get(this, 'pubnub');
    const channel = 'lobby';

    pubnub.addListener({
      status: function(status) {
        const message = 'Hello, World';

        if (status.category === 'PNConnectedCategory') {
          pubnub.publish({ channel, message }, function(status) {
            // handle publish status.
          });
        }
      }, message: function(message) {
        // handle message.
      }, presence: function(event) {
        // handle presence.
      }
    });

    pubnub.subscribe({
      channels: [channel],
      withPresence: true
    });
  })
});
```

By following this pattern on a client that both subscribes and publishes to a
channel a client will be able to receive it own published messages. It also
sets up a callback to receive message from other clients on the channel and
presence events.

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

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember
  versions)
* `ember test`
* `ember test --server`

### Building

* `ember build`

For more information on using ember-cli, visit
[https://ember-cli.com/](https://ember-cli.com/).
