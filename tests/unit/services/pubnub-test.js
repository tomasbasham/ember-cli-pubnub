import Sinon from 'sinon';

import { get, set } from '@ember/object';
import { moduleFor, test } from 'ember-qunit';

const {
  match
} = Sinon;

let sandbox;

moduleFor('service:pubnub', 'Unit | Service | pubnub', {
  beforeEach() {
    sandbox = Sinon.sandbox.create();
  },

  afterEach() {
    sandbox.restore();
  }
});

test('it initialises the pubnub object', function(assert) {
  let service = this.subject();
  assert.ok(get(service, 'pubnub'));
});

test('it initialises the channels array', function(assert) {
  let service = this.subject();

  assert.deepEqual(get(service, '_channels'), []);
});

test('it initialises the presence object', function(assert) {
  let service = this.subject();
  assert.deepEqual(get(service, '_presence'), {});
});

test('it initialises the presData object', function(assert) {
  let service = this.subject();
  assert.deepEqual(get(service, '_presData'), {});
});

test('#audit calls pubnub with the correct arguments', function(assert) {
  let service = this.subject();

  const pubnub = get(service, 'pubnub');
  const stub = sandbox.stub(pubnub, 'audit', function() {
    return true;
  });

  const callbackStub = sandbox.stub();

  service.audit({ channel: 'enterprise', callback: callbackStub });
  assert.ok(stub.calledWith({ channel: 'enterprise', callback: callbackStub }));
});

test('#grant calls pubnub with the correct arguments', function(assert) {
  let service = this.subject();

  const pubnub = get(service, 'pubnub');
  const stub = sandbox.stub(pubnub, 'grant', function() {
    return true;
  });

  const callbackStub = sandbox.stub();

  service.grant({ channel: 'enterprise', callback: callbackStub });
  assert.ok(stub.calledWith({ channel: 'enterprise', callback: callbackStub }));
});

test('#hereNow calls pubnub with the correct arguments', function(assert) {
  assert.expect(2);

  let service = this.subject();

  const pubnub = get(service, 'pubnub');
  const stub = sandbox.stub(pubnub, 'here_now', function() {
    return true;
  });

  const installHandlersSpy = sandbox.spy(service, '_installHandlers');

  service.hereNow({ channel: 'enterprise' });

  assert.ok(installHandlersSpy.calledOnce);
  assert.ok(stub.calledWith({ channel: 'enterprise', callback: match.func, state: true, uuids: true }));
});

test('#history calls pubnub with the correct arguments', function(assert) {
  assert.expect(2);

  let service = this.subject();

  const pubnub = get(service, 'pubnub');
  const stub = sandbox.stub(pubnub, 'history', function() {
    return true;
  });

  const messageEventHandlerSpy = sandbox.spy(service, 'messageEventHandler');

  service.history({ channel: 'enterprise' });

  assert.ok(messageEventHandlerSpy.calledOnce);
  assert.ok(stub.calledWith({ channel: 'enterprise', callback: match.func }));
});

test('#publish calls pubnub with the correct arguments', function(assert) {
  let service = this.subject();

  const pubnub = get(service, 'pubnub');
  const stub = sandbox.stub(pubnub, 'publish', function() {
    return true;
  });

  const callbackStub = sandbox.stub();

  service.publish({ channel: 'enterprise', message: 'engage', callback: callbackStub });
  assert.ok(stub.calledWith({ channel: 'enterprise', message: 'engage', callback: callbackStub }));
});

test('#revoke calls pubnub with the correct arguments', function(assert) {
  let service = this.subject();

  const pubnub = get(service, 'pubnub');
  const stub = sandbox.stub(pubnub, 'grant', function() {
    return true;
  });

  const callbackStub = sandbox.stub();

  service.revoke({ channel: 'enterprise', callback: callbackStub });
  assert.ok(stub.calledWith({ channel: 'enterprise', callback: callbackStub }));
});

test('#setAuthKey calls pubnub with the correct arguments', function(assert) {
  let service = this.subject();

  const pubnub = get(service, 'pubnub');
  const stub = sandbox.stub(pubnub, 'auth', function() {
    return true;
  });

  service.setAuthKey('Picard-4-7-Alpha-Tango');
  assert.ok(stub.calledWith('Picard-4-7-Alpha-Tango'));
});

test('#setState calls pubnub with the correct arguments', function(assert) {
  let service = this.subject();

  const pubnub = get(service, 'pubnub');
  const stub = sandbox.stub(pubnub, 'state', function() {
    return true;
  });

  const callbackStub = sandbox.stub();

  service.setState({ channel: 'enterprise', callback: callbackStub });
  assert.ok(stub.calledWith({ channel: 'enterprise', callback: callbackStub }));
});

test('#setUuid calls pubnub with the correct arguments', function(assert) {
  let service = this.subject();

  const pubnub = get(service, 'pubnub');
  const stub = sandbox.stub(pubnub, 'set_uuid', function() {
    return true;
  });

  service.setUuid('NCC-1071');
  assert.ok(stub.calledWith('NCC-1071'));
});

test('#state calls pubnub with the correct arguments', function(assert) {
  let service = this.subject();

  const pubnub = get(service, 'pubnub');
  const stub = sandbox.stub(pubnub, 'state', function() {
    return true;
  });

  const callbackStub = sandbox.stub();

  service.state({ channel: 'enterprise', callback: callbackStub });
  assert.ok(stub.calledWith({ channel: 'enterprise', callback: callbackStub }));
});

test('#subscribe calls pubnub with the correct arguments', function(assert) {
  assert.expect(2);

  let service = this.subject();

  const pubnub = get(service, 'pubnub');
  const stub = sandbox.stub(pubnub, 'subscribe', function() {
    return true;
  });

  const installHandlersSpy = sandbox.spy(service, '_installHandlers');

  service.subscribe('enterprise');

  assert.ok(installHandlersSpy.calledOnce);
  assert.ok(stub.calledWith({ channel: 'enterprise', message: match.func, presence: match.func }));
});

test('#subscribe does not resubscribe to a channel', function(assert) {
  let service = this.subject();

  const pubnub = get(service, 'pubnub');
  const stub = sandbox.stub(pubnub, 'subscribe', function() {
    return true;
  });

  service.subscribe('enterprise');
  service.subscribe('enterprise');

  assert.ok(stub.calledOnce);
});

test('#subscribe caches subscribed channels', function(assert) {
  let service = this.subject();

  const pubnub = get(service, 'pubnub');
  sandbox.stub(pubnub, 'subscribe', function() {
    return true;
  });

  service.subscribe('enterprise');
  assert.deepEqual(get(service, '_channels'), ['enterprise']);
});

test('#subscribe caches presence data for a channel', function(assert) {
  let service = this.subject();

  const pubnub = get(service, 'pubnub');
  sandbox.stub(pubnub, 'subscribe', function() {
    return true;
  });

  service.subscribe('enterprise');
  assert.deepEqual(get(service, '_presence.enterprise'), []);
});

test('#time calls pubnub with the correct arguments', function(assert) {
  let service = this.subject();

  const pubnub = get(service, 'pubnub');
  const stub = sandbox.stub(pubnub, 'time', function() {
    return true;
  });

  const callbackStub = sandbox.stub();

  service.time(callbackStub);
  assert.ok(stub.calledWith(callbackStub));
});

test('#unsubscribe calls pubnub with the correct arguments', function(assert) {
  let service = this.subject();

  const pubnub = get(service, 'pubnub');
  const stub = sandbox.stub(pubnub, 'unsubscribe', function() {
    return true;
  });

  service.unsubscribe({ channel: 'enterprise' });
  assert.ok(stub.calledWith({ channel: 'enterprise' }));
});

test('#unsubscribe removes cached subscribed channels', function(assert) {
  let service = this.subject();

  set(service, '_channels', ['enterprise', 'voyager']);

  service.unsubscribe({ channel: 'enterprise' });
  assert.deepEqual(get(service, '_channels'), ['voyager']);
});

test('#unsubscribe removes cached presence data for a channel', function(assert) {
  let service = this.subject();

  set(service, '_presence.enterprise', ['Jean-Luc Picard', 'William Thomas Riker', 'Geordi La Forge', 'Data']);

  service.unsubscribe({ channel: 'enterprise' });
  assert.equal(get(service, '_presence.enterprise'), null);
});

test('#unsubscribe removes events from a channel', function(assert) {
  let service = this.subject();

  const spy = sandbox.spy(service, 'off');

  service.unsubscribe({ channel: 'enterprise' });
  assert.ok(spy.calledTwice);
});

test('#uuid calls pubnub with the correct arguments', function(assert) {
  let service = this.subject();

  const pubnub = get(service, 'pubnub');
  const stub = sandbox.stub(pubnub, 'uuid', function() {
    return true;
  });

  const callbackStub = sandbox.stub();

  service.uuid(callbackStub);
  assert.ok(stub.calledWith(callbackStub));
});

test('#whereNow calls pubnub with the correct arguments', function(assert) {
  let service = this.subject();

  const pubnub = get(service, 'pubnub');
  const stub = sandbox.stub(pubnub, 'where_now', function() {
    return true;
  });

  const callbackStub = sandbox.stub();

  service.whereNow({ callback: callbackStub });
  assert.ok(stub.calledWith({ callback: callbackStub }));
});

test('#me calls pubnub with the correct arguments', function(assert) {
  let service = this.subject();

  const pubnub = get(service, 'pubnub');
  const stub = sandbox.stub(pubnub, 'get_uuid', function() {
    return true;
  });

  service.me();
  assert.ok(stub.calledOnce);
});

test('#listChannels lists subscribed channels', function(assert) {
  let service = this.subject();

  set(service, '_channels', ['enterprise', 'voyager', 'defiant', 'excelsior']);

  const channels = service.listChannels();
  assert.deepEqual(channels, ['enterprise', 'voyager', 'defiant', 'excelsior']);
});

test('#listPresence lists subscribed users for a channel', function(assert) {
  let service = this.subject();

  set(service, '_presence.enterprise', ['Jean-Luc Picard', 'William Thomas Riker', 'Geordi La Forge', 'Data']);

  const presence = service.listPresence('enterprise');
  assert.deepEqual(presence, ['Jean-Luc Picard', 'William Thomas Riker', 'Geordi La Forge', 'Data']);
});

test('#presenceData lists cached presence data for a channel', function(assert) {
  let service = this.subject();

  set(service, '_presData.enterprise', {
    'NCC-1071': 'Active'
  });

  const presenceData = service.presenceData('enterprise');
  assert.deepEqual(presenceData, { 'NCC-1071': 'Active' });
});

test('#messageEventHandler triggers an event for each returned message', function(assert) {
  assert.expect(5);

  let service = this.subject();

  const pubnub = get(service, 'pubnub');
  const stub = sandbox.stub(pubnub, 'each', function(messages, callback) {
    messages.forEach(callback);
  });

  const messageEventStringSpy = sandbox.spy(service, 'messageEventString');
  const triggerSpy = sandbox.spy(service, 'trigger');

  const handler = service.messageEventHandler('enterprise');
  handler([['message1', 'message2', 'message3'], 'some', 'other', 'stuff']);

  assert.ok(stub.calledOnce);
  assert.ok(stub.calledWith(['message1', 'message2', 'message3'], match.func));

  assert.ok(messageEventStringSpy.calledOnce);
  assert.ok(messageEventStringSpy.calledWith('enterprise'));

  assert.ok(triggerSpy.calledThrice);
});

test('#messageEventString returns an event string scoped to a channel', function(assert) {
  let service = this.subject();
  assert.equal(service.messageEventString('enterprise'), 'pn-message:enterprise');
});

test('#presenceEventString returns an event string scoped to a channel', function(assert) {
  let service = this.subject();
  assert.equal(service.presenceEventString('enterprise'), 'pn-presence:enterprise');
});
