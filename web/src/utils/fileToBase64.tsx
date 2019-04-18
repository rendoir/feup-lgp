export function fileToBase64(
  file: Blob,
  callback: (dataUri: string) => void
): void {
  const reader: FileReader = new FileReader();
  reader.onload = (event: any) => callback(event.target.result);
  reader.readAsDataURL(file);
}
