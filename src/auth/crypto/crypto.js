import CryptoJS from "crypto-js";

const appCipherKey = "demoappgenericgstkey2024" // 24-byte generic client cipher key

// encrypt Data
const encryptData = (value) => {
    const data = CryptoJS.AES.encrypt(
        JSON.stringify(value),
        appCipherKey
    ).toString();
    return data;
};

// decrypt Data
const decryptData = (value) => {
    const data = CryptoJS.AES.decrypt(value, appCipherKey);
    const new1 = data?.toString(CryptoJS.enc.Utf8);
    // console.log("new1=", new1)
    var decryptedData = new1 ? JSON.parse(new1) : null;
    // var decryptedData = JSON.parse(data?.toString(CryptoJS.enc.Utf8));
    return decryptedData;
};

const getLocalValue = (fieldName) => {
    const x = decryptData(localStorage.getItem(fieldName))
    return x
}


function encrypt(text) { // hh:mm:ss
    var key = CryptoJS.enc.Utf8.parse(appCipherKey);
    var iv = CryptoJS.enc.Base64.parse('QUJDREVGR0g=');
    var encoded = CryptoJS.enc.Utf8.parse(text);
    var ciphertext = CryptoJS.TripleDES.encrypt(encoded, key, { mode: CryptoJS.mode.CBC, iv: iv });
    return ciphertext.toString();
}


function decrypt(encryptedText) {
    var key = CryptoJS.enc.Utf8.parse(appCipherKey);
    var iv = CryptoJS.enc.Base64.parse('QUJDREVGR0g=');
    var bytes = CryptoJS.TripleDES.decrypt(encryptedText, key, { mode: CryptoJS.mode.CBC, iv: iv });
    var decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedText;
}

export default { encryptData, decryptData, encrypt, decrypt, getLocalValue }
