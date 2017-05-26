import { remote } from 'electron';

const transit = require('transit-immutable-js');

export default function getInitialStateRenderer() {
  return transit.fromJSON(remote.getGlobal('reduxState'));
}
