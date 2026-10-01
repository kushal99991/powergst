import CryptoJS from "crypto-js";

const secretPass = "bXZwbEAyMDIyJHBvd2VyZ3N0" // mvpl@2022$GenericGST

// encrypt Data
const encryptData = (value) => {
    const data = CryptoJS.AES.encrypt(
        JSON.stringify(value),
        secretPass
    ).toString();
    return data;
};

// decrypt Data
const decryptData = (value) => {
    const data = CryptoJS.AES.decrypt(value, secretPass);
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
    var key = CryptoJS.enc.Utf8.parse(secretPass);
    var iv = CryptoJS.enc.Base64.parse('QUJDREVGR0g=');
    var encoded = CryptoJS.enc.Utf8.parse(text);
    var ciphertext = CryptoJS.TripleDES.encrypt(encoded, key, { mode: CryptoJS.mode.CBC, iv: iv });
    return ciphertext.toString();
}


function decrypt(encryptedText) {
    var key = CryptoJS.enc.Utf8.parse(secretPass);
    var iv = CryptoJS.enc.Base64.parse('QUJDREVGR0g=');
    var bytes = CryptoJS.TripleDES.decrypt(encryptedText, key, { mode: CryptoJS.mode.CBC, iv: iv });
    var decryptedText = bytes.toString(CryptoJS.enc.Utf8);
    return decryptedText;
}

export default { encryptData, decryptData, encrypt, decrypt, getLocalValue }
