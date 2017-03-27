import { remote } from 'electron';

export default function getInitialStateRenderer() {
  return JSON.parse(remote.getGlobal('reduxStateStringified'))
}
