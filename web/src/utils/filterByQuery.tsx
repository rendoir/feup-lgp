export type Filterable<T> = T[];

function normalize(text: string) {
  return text.toLowerCase().replace(/ë/g, "e");
}

export function filterByQuery<T, C = Filterable<T>>(
  query: string,
  items: C,
  getValue: (item: T) => string
): C {
  const normalQuery = normalize(query);

  return items.map((item: T) => {
    const value = normalize(getValue(item));

    return {
      item,
      score: value.indexOf(normalQuery)
    };
  });
}
