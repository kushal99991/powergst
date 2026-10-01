export const base64ToBuffer = (str) => {
    str = window.atob(str); // creates a ASCII string
    var buffer = new ArrayBuffer(str.length),
        view = new Uint8Array(buffer);
    for(var i = 0; i < str.length; i++){
        view[i] = str.charCodeAt(i);
    }
    return buffer;
}

