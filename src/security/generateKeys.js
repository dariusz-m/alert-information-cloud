import Elliptic from "elliptic";

export const generateKeys = () => {
    const elliptic = new Elliptic.ec('p256'); // eslint-disable-line new-cap
    const keyPair = elliptic.genKeyPair();

    return {
        publicKey: keyPair.getPublic('hex'),
        privateKey: keyPair.getPrivate('hex')
    };
};
