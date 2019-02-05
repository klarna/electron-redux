export default function replayActionServer(peers) {
  return (store) => {
    peers.setNotificationHandler('redux-action', peer => (payload) => {
      if (payload.sender !== peer.id) {
        store.dispatch(payload);
      }
    });
  };
}
