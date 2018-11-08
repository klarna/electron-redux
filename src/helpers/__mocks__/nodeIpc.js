export default jest.fn();

export const getIPCServer = {
  emit: jest.fn(),
  on: jest.fn(),
};

export const getIPCClient = {
  emit: jest.fn(),
  on: jest.fn(),
};
