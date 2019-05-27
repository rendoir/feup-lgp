export function selectFiles(
  callback: (files: File[]) => void,
  multiple?: boolean,
  accept?: string
) {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = Boolean(multiple);
  if (accept) {
    input.accept = accept;
  }

  input.onchange = () => {
    callback(Array.from(input.files as ArrayLike<File>));

    input.onchange = null;
  };

  input.click();
}
