import { remote } from 'electron';
import getInitialStateRenderer from '../getInitialStateRenderer';

jest.unmock('../getInitialStateRenderer');

describe('getInitialStateRenderer', () => {
  it('should return the initial state', () => {
    remote.getGlobal.mockImplementation(() => 456);

    expect(getInitialStateRenderer()).toBe(456);
  });
});
