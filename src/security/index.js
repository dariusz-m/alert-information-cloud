import Elliptic from "elliptic";
import CryptoJS from "crypto-js";


export const encrypt = (clientPrivateKey, serverPublicKey, message) => {
    const key = prepareSharedKey(clientPrivateKey, serverPublicKey);
    const wordArray = CryptoJS.enc.Utf8.parse(message);

    const encrypted = CryptoJS.AES.encrypt(wordArray, key, cryptoAESConfig);

    return encrypted.toString();
};

export const decrypt = (clientPrivateKey, serverPublicKey, ciphertext) => {
    const key = prepareSharedKey(clientPrivateKey, serverPublicKey);

    let decrypted = CryptoJS.AES.decrypt(ciphertext, key, cryptoAESConfig);

    return decrypted.toString(CryptoJS.enc.Utf8);
};


const prepareSharedKey = (clientPrivateKey, serverPublicKey) => {
    const elliptic = new Elliptic.ec('p256'); // eslint-disable-line new-cap
    const privateKey = elliptic.keyFromPrivate(clientPrivateKey, 'hex');
    const publicKey = elliptic.keyFromPublic(serverPublicKey, 'hex');
    const sharedKey = privateKey.derive(publicKey.getPublic());

    return CryptoJS.enc.Utf8.parse(sharedKey.toString(16).slice(0, 32));
};

const cryptoAESConfig = { mode: CryptoJS.mode.ECB, padding: CryptoJS.pad.Pkcs7 };
