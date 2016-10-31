import { isFSA } from 'flux-standard-action';
import debug from 'debug';

const log = debug('electron-redux:validateAction');

export default function validateAction(action) {
  if (!isFSA(action)) {
    log('WARNING! Action not FSA-compliant', action);

    return false;
  }

  return true;
}
