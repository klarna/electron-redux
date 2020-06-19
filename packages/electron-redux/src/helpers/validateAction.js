import debug from 'debug';
import { isFSA } from './fluxStandardAction';

const log = debug('electron-redux:validateAction');

export default function validateAction(action) {
  if (!isFSA(action)) {
    log('WARNING! Action not FSA-compliant', action);

    return false;
  }

  return true;
}
