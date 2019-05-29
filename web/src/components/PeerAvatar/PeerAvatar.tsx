import React, { MouseEvent } from "react";
import { PeerInfo, UserStatusType } from "../../utils/types";
import Avatar from "../Avatar/Avatar";
import getAvatarPlaceholder from "../Avatar/utils/getAvatarPlaceholder";

export type Props = {
  className?: string;
  peer: PeerInfo;
  size: number;
  status?: UserStatusType;
  onClick?: (event: MouseEvent) => any;
};

function PeerAvatar(props: Props) {
  return (
    <Avatar
      className={props.className}
      title={props.peer.title}
      image={props.peer.avatar}
      size={props.size}
      placeholder={getAvatarPlaceholder(props.peer.peer.id)}
      onClick={props.onClick}
      status={props.status}
    />
  );
}

export default PeerAvatar;
