import { List, OrderedSet } from "immutable";
import { PeerInfo } from "../../utils/types";

export interface ISelectorState<T> {
  hasQuery(): boolean;
  getQuery(): string;
  setQuery(query: string): ISelectorState<T>;
  getShow(): boolean;
  setShow(show: boolean): ISelectorState<T>;
  getItems(): List<T>;
  getItem(index: number): T;
  replaceItems(items: Iterable<T>): ISelectorState<T>;
  getHovered(): T;
  getHoverIndex(): number;
  setHoverIndex(index: number): ISelectorState<T>;
  getSelected(): OrderedSet<T>;
  isSelected(item: T): boolean;
  addSelected(item: T): ISelectorState<T>;
  clearSelection(): ISelectorState<T>;
  deleteSelected(item: T): ISelectorState<T>;
  toggleSelected(item: T): ISelectorState<T>;
  handleKeyboardEvent(event: KeyboardEvent): ISelectorState<T>;
}

export type SelectorStateCreator<T> = {
  create(items: T[]): ISelectorState<T>;
};

export type Request = {
  type: "group" | "channel";
  title: string;
  shortname: string;
  about: string;
  avatar?: File | null;
  members: ISelectorState<PeerInfo>;
};

export type Step = "type" | "info" | "avatar" | "members";

export type Props = {
  id: string;
  className?: string;
  step: Step;
  error?: string | null;
  pending: boolean;
  request: Request;
  shortnamePrefix?: string | null;
  autoFocus: boolean;
  maxGroupSize: number;
  isPublicGroupEnabled: boolean;
  onClose: () => any;
  onSubmit: (request: Request) => any;
  onStepChange: (step: Step) => any;
  onRequestChange: (request: Request) => any;
  isMaxGroupSizeVisible: boolean;
};
