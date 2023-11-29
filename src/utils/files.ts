
export function downloadFile(data: BlobPart, mime: string, filename: string) {
  const url = URL.createObjectURL(new Blob([data], { type: mime }));
  
  const link = document.createElement("a");
  link.download = filename;
  link.href = url;
  link.click();
  
  URL.revokeObjectURL(url);
}

export function openFile(text: true, accept: string, callback: (content: string, file: File) => void): void;
export function openFile(text: false, accept: string, callback: (content: ArrayBuffer, file: File) => void): void;
export function openFile(text: boolean, accept: string, callback: (content: string | ArrayBuffer, file: File) => void): void;
export function openFile(text: boolean, accept: string, callback: (content: any, file: File) => void) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = accept;
  input.addEventListener("change", () => {
    const file = input.files?.item(0);
    if(!file) return;
    
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if(reader.result !== null) callback(reader.result, file);
    });
    if(text) reader.readAsText(file);
    else reader.readAsArrayBuffer(file);
  });
  input.click();
}
