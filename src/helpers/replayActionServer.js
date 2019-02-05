export default function replayActionServer(peers) {
  return (store) => {
    peers.setNotificationHandler('redux-action', (payload) => {
      store.dispatch(payload);
    });
  };
}
