import { List } from "immutable";

export type Filterable<T> = List<T>;

function normalize(text: string) {
  return text.toLowerCase().replace(/ë/g, "e");
}

export function filterByQuery<T>(
  query: string,
  items: Filterable<T>,
  getValue: (item: T) => string
): Filterable<T> {
  const normalQuery = normalize(query);

  return items
    .map((item: T) => {
      const value = normalize(getValue(item));

      return {
        item,
        score: value.indexOf(normalQuery)
      };
    })
    .filter(({ score }: any) => score !== -1)
    .sort((a: any, b: any) => a.score - b.score)
    .map(({ item }: any) => item);
}
