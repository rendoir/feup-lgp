import { List, OrderedSet, Record } from "immutable";
import { calculateCursor } from "../../utils/calculateCursor";
import { filterByQuery } from "../../utils/filterByQuery";
import { SelectorStateCreator } from "./types";

function createSelectorState<T>(
  name: string,
  getValue: (item: T) => string,
  clearAfterSelection: boolean = false
): SelectorStateCreator<T> {
  const defaultRecord = {
    filtered: List(),
    hoverIndex: 0,
    items: List(),
    query: "",
    selected: OrderedSet(),
    show: true
  };

  function filter(query: string, items: List<T>): List<T> {
    return List(filterByQuery(query, items, getValue));
  }

  class SelectorState extends Record(defaultRecord, name) {
    public hasQuery(): boolean {
      return Boolean(this.get("query"));
    }

    public getQuery(): string {
      return this.get("query");
    }

    public setQuery(query: string, force: boolean = false): SelectorState {
      if (!force && query === this.get("query")) {
        return this;
      }

      const filtered = filter(query, this.get("items"));

      let hoverIndex = 0;
      if (this.getHoverIndex() !== 0) {
        const hovered = this.getHovered();
        const sameHoverIndex = filtered.findIndex(item => item === hovered);
        if (sameHoverIndex !== -1) {
          hoverIndex = sameHoverIndex;
        }
      }

      return this.set("query", query)
        .set("filtered", filtered)
        .set("hoverIndex", hoverIndex);
    }

    public getShow(): boolean {
      return this.get("show");
    }

    public setShow(show: boolean): SelectorState {
      return this.set("show", show);
    }

    public getItems(): List<T> {
      return this.get("filtered");
    }

    public getItem(index: number): T {
      return this.getItems().get(index) as T;
    }

    public getHovered(): T {
      return this.getItem(this.getHoverIndex());
    }

    public getHoverIndex(): number {
      return this.get("hoverIndex");
    }

    public setHoverIndex(hoverIndex: number): SelectorState {
      const max = this.getItems().size;

      return this.set("hoverIndex", calculateCursor({ max, next: hoverIndex }));
    }

    public replaceItems(items: Iterable<T>): SelectorState {
      return this.set("items", List(items)).setQuery(this.getQuery(), true);
    }

    public getSelected(): OrderedSet<T> {
      return this.get("selected");
    }

    public isSelected(item: T): boolean {
      return this.getSelected().has(item);
    }

    public addSelected(item: T): SelectorState {
      const selected = this.get("selected");
      let nextState = this.set("selected", selected.add(item));
      if (clearAfterSelection) {
        nextState = nextState.setQuery("") as this;
      }

      return nextState;
    }

    public deleteSelected(item: T): SelectorState {
      const selected = this.get("selected");
      let nextState = this.set("selected", selected.delete(item));
      if (clearAfterSelection) {
        nextState = nextState.setQuery("") as this;
      }

      return nextState;
    }

    public toggleSelected(item: T): SelectorState {
      const selected = this.get("selected");

      return selected.has(item)
        ? this.deleteSelected(item)
        : this.addSelected(item);
    }

    public clearSelection(): SelectorState {
      return this.set("selected", this.get("selected").clear());
    }

    public handleKeyboardEvent(event: KeyboardEvent): SelectorState {
      switch (event.key) {
        case "Esc":
          event.preventDefault();

          return this.setShow(false).setQuery("");

        case "Tab":
          event.preventDefault();

          return this.addSelected(this.getHovered());

        case "Enter":
          event.preventDefault();

          return this.toggleSelected(this.getHovered());

        case "ArrowUp":
          event.preventDefault();

          return this.setHoverIndex(this.getHoverIndex() - 1);

        case "ArrowDown":
          event.preventDefault();

          return this.setHoverIndex(this.getHoverIndex() + 1);

        case "Backspace":
          if (!this.hasQuery()) {
            event.preventDefault();
            const last = this.getSelected().last() as T;
            if (last) {
              return this.deleteSelected(last);
            }
          }

          return this;

        default:
          return this;
      }
    }
  }

  return {
    create(items: T[]): SelectorState {
      const list = List(items);

      return new SelectorState({
        filtered: list,
        items: list
      });
    }
  };
}

export default createSelectorState;
