import { remote } from 'electron';
import getInitialStateRenderer from '../getInitialStateRenderer';

jest.unmock('../getInitialStateRenderer');

describe('getInitialStateRenderer', () => {
  it('should return the initial state', () => {
    const state = { foo: 456 };
    remote.getGlobal.mockImplementation(() => () => JSON.stringify(state));

    expect(getInitialStateRenderer()).toEqual(state);
  });
});
