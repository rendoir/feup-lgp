export type AvatarSIze = "small" | "large" | "full";

export type AvatarPlaceholder =
  | "empty"
  | "blue"
  | "blue"
  | "purple"
  | "red"
  | "orange"
  | "yellow"
  | "green";

export type UserStatusType = "away" | "unset" | "invisible" | "do_not_disturb";

export type ColorTheme =
  | "default"
  | "primary"
  | "success"
  | "danger"
  | "info"
  | "warning";

export type IconSize =
  | "xs"
  | "sm"
  | "lg"
  | "1x"
  | "2x"
  | "3x"
  | "4x"
  | "5x"
  | "6x"
  | "7x"
  | "8x"
  | "9x"
  | "10x";

export type ClientRect = {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
};

export type PeerType = "user" | "group" | "sip";

export type Peer = {
  id: number;
  type: PeerType;
  key?: string;
};

export type PeerInfoType = "user" | "group" | "channel" | "sip";

export type PeerInfo = {
  peer: Peer;
  type: PeerInfoType;
  title: string;
  userName?: string | null;
  avatar?: string | null;
  bigAvatar?: string | null;
  placeholder: AvatarPlaceholder;
};
