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

export type RequestChallenge = {
  type: "question" | "options" | "post" | "comment";
  title: string;
  about: string;
  dateStart: string;
  dateEnd: string;
  post: string;
  question: string;
  correctAnswer: string;
  options: string[];
  switcher: string;
  prize: string;
  pointsPrize: string;
};

export type StepChallenge = "type" | "info";

export type Props = {
  id: string;
  className?: string;
  step: StepChallenge;
  error?: string | null;
  pending: boolean;
  tags?: string[];
  request: RequestChallenge;
  shortnamePrefix?: string;
  autoFocus: boolean;
  maxGroupSize: number;
  isPublicGroupEnabled: boolean;
  onClose: () => any;
  onSubmit: (request: RequestChallenge) => any;
  onStepChange: (step: StepChallenge) => any;
  onRequestChange: (request: RequestChallenge) => any;
  isMaxGroupSizeVisible: boolean;
};
