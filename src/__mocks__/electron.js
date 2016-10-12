export default jest.fn();

export const BrowserWindow = {
  getAllWindows: jest.fn(() => []),
};

export const ipcMain = {
  on: jest.fn(),
};

export const ipcRenderer = {
  on: jest.fn(),
  send: jest.fn(),
};
