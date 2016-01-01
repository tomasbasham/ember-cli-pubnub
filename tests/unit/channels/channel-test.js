import { moduleFor, test } from 'ember-qunit';
import Pubnub from '../../../services/pubnub';
import Sinon from 'sinon';

let sandbox, pubnub;

moduleFor('channel:channel', 'Unit | Channels | channel', {
  beforeEach() {
    sandbox = Sinon.sandbox.create();
    pubnub = Pubnub.create();
  },

  afterEach() {
    sandbox.restore();
  }
});

test('it can be configured with a name', function(assert) {
  let model = this.subject({ name: 'enterprise' });
  assert.ok(model);
});

test('#audit calls pubnub with the correct arguments', function(assert) {
  let model = this.subject({ name: 'enterprise', pubnub });

  const stub = sandbox.stub(pubnub, 'audit', function() {
    return true;
  });

  const callbackStub = sandbox.stub();

  model.audit(callbackStub);
  assert.ok(stub.calledWith({ channel: 'enterprise', callback: callbackStub }));
});

test('#grant calls pubnub with the correct arguments', function(assert) {
  let model = this.subject({ name: 'enterprise', pubnub });

  const stub = sandbox.stub(pubnub, 'grant', function() {
    return true;
  });

  const callbackStub = sandbox.stub();

  model.grant(callbackStub);
  assert.ok(stub.calledWith({ channel: 'enterprise', callback: callbackStub }));
});

test('#hereNow calls pubnub with the correct arguments', function(assert) {
  assert.expect(2);

  let model = this.subject({ name: 'enterprise', pubnub });

  const hereNowStub = sandbox.stub(pubnub, 'hereNow', function() {
    return true;
  });

  const listPresenceStub = sandbox.stub(pubnub, 'listPresence', function() {
    return false;
  });

  model.hereNow();

  assert.ok(listPresenceStub.calledWith('enterprise'));
  assert.ok(hereNowStub.calledWith({ channel: 'enterprise' }));
});

test('#hereNow lists subscribed users for this channel', function(assert) {
  let model = this.subject({ name: 'enterprise', pubnub });

  const presence = model.hereNow();
  assert.deepEqual(presence, []);
});

test('#history calls pubnub with the correct arguments', function(assert) {
  let model = this.subject({ name: 'enterprise', pubnub });

  const stub = sandbox.stub(pubnub, 'history', function() {
    return true;
  });

  model.history();
  assert.ok(stub.calledWith({ channel: 'enterprise' }));
});

test('#on calls pubnub with the correct arguments', function(assert) {
  assert.expect(2);

  let model = this.subject({ name: 'enterprise', pubnub });

  const stub = sandbox.stub(pubnub, 'on', function() {
    return true;
  });

  const callbackStub = sandbox.stub();
  const eventStub = sandbox.stub(pubnub, 'messageEventString', function(channel) {
    return `pn-message:${channel}`;
  });

  model.on(eventStub, callbackStub);

  assert.ok(eventStub.calledWith('enterprise'));
  assert.ok(stub.calledWith(`pn-message:${'enterprise'}`, callbackStub));
});

test('#publish calls pubnub with the correct arguments', function(assert) {
  let model = this.subject({ name: 'enterprise', pubnub });

  const stub = sandbox.stub(pubnub, 'publish', function() {
    return true;
  });

  const callbackStub = sandbox.stub();

  model.publish({ message: 'engage' }, callbackStub);
  assert.ok(stub.calledWith({ channel: 'enterprise', callback: callbackStub, message: 'engage' }));
});

test('#revoke calls pubnub with the correct arguments', function(assert) {
  let model = this.subject({ name: 'enterprise', pubnub });

  const stub = sandbox.stub(pubnub, 'revoke', function() {
    return true;
  });

  const callbackStub = sandbox.stub();

  model.revoke(callbackStub);
  assert.ok(stub.calledWith({ channel: 'enterprise', callback: callbackStub }));
});

test('#setState calls pubnub with the correct arguments', function(assert) {
  let model = this.subject({ name: 'enterprise', pubnub });

  const stub = sandbox.stub(pubnub, 'setState', function() {
    return true;
  });

  const callbackStub = sandbox.stub();

  model.setState(callbackStub);
  assert.ok(stub.calledWith({ channel: 'enterprise', callback: callbackStub }));
});

test('#state calls pubnub with the correct arguments', function(assert) {
  let model = this.subject({ name: 'enterprise', pubnub });

  const stub = sandbox.stub(pubnub, 'state', function() {
    return true;
  });

  const callbackStub = sandbox.stub();

  model.state(callbackStub);
  assert.ok(stub.calledWith({ channel: 'enterprise', callback: callbackStub }));
});

test('#unsubscribe calls pubnub with the correct arguments', function(assert) {
  let model = this.subject({ name: 'enterprise', pubnub });

  const stub = sandbox.stub(pubnub, 'unsubscribe', function() {
    return true;
  });

  model.unsubscribe();
  assert.ok(stub.calledWith({ channel: 'enterprise' }));
});
