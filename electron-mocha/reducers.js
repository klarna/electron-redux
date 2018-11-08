export default function reducer(state = {}, action) {
  if (action.type === 'test1') {
    return {
      test: 1,
    };
  }
  if (action.type === 'test2') {
    return {
      test: 2,
    };
  }
  return state;
}
