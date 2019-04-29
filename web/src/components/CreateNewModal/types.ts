import { List, OrderedSet } from "immutable";

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

export type SelectorStateCreater<T> = {
  create(items: T[]): ISelectorState<T>;
};
