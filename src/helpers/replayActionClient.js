export default function replayActionClient(peer) {
  return (store) => {
    peer.setNotificationHandler('redux-action', (payload) => {
      if (payload.sender !== peer.id) {
        store.dispatch(payload);
      }
    });
  };
}
