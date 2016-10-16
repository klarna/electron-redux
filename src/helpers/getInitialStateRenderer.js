import { remote } from 'electron';

export default function getInitialStateRenderer() {
  return remote.getGlobal('reduxState');
}
