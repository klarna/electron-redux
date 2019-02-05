const transit = require('transit-immutable-js');

export default function getInitialStateClient(peer) {
  return peer.request('client-ask-initial-state')
    .then(payload => transit.fromJSON(payload));
}
