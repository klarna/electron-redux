export default function replayActionServer(peers) {
  return (store) => {
    peers.setNotificationHandler('redux-action', peer => (payload) => {
      console.log('peerS.setNotificationHandler', payload.sender, peer.id)
      if (payload.sender !== peer.id) {
        store.dispatch(payload);
      }
    });
  };
}
