import { PeerInfo } from '../../utils/types';
import createSelectorState from './createSelectorState';
import { SelectorStateCreator } from './types';

function peerInfoToQueryString(info: PeerInfo): string {
  if (info.userName) {
    return info.title + ' ' + info.userName;
  }

  return info.title;
}

export const PeerInfoSelectorState: SelectorStateCreator<
  PeerInfo
> = createSelectorState('PeerInfoSelectorState', peerInfoToQueryString, true);
