import {encrypt, decrypt} from "./index";
import {generateKeys} from "./generateKeys";

/**
 * Mock generate keys.
 *
 * @returns {Object}
 */
function mockGenerateKeys() {
    const keys = {
        publicKey: "02339dd42179e4e7ed4624c97d7f7e1e1794cfcb53602d5982b6fe3a09b81bc887",
        privateKey: "872061289885f22a3b550abda2bf14b7272c18d01d037f9b367747485d80f6a1"
    };
    return {
        generateKeys: jest.fn().mockImplementation(() => keys),
    };
}
jest.mock('./generateKeys', () => mockGenerateKeys());

describe('Security tests', () => {
    let privateKey = null;
    let publicKey = null;

    beforeEach(() => {
        privateKey = "872061289885f22a3b550abda2bf14b7272c18d01d037f9b367747485d80f6a1";
        publicKey = "02339dd42179e4e7ed4624c97d7f7e1e1794cfcb53602d5982b6fe3a09b81bc887";
    });

    it('Test encryption and decryption own message', () => {
        expect.hasAssertions();
        const expectedMessage = "Test encryption and decryption message";

        const ciphertext = encrypt(privateKey, publicKey, expectedMessage);
        const decryptedMessage = decrypt(privateKey, publicKey, ciphertext);

        expect(expectedMessage).toBe(decryptedMessage);
    });

    it('Test decryption message that was generated on server side', () => {
        expect.hasAssertions();
        const expectedMessage = "{\"message\":\"ghghghg\",\"from_user\":{\"id\":0,\"firstname\":\"Admin\",\"" +
            "lastname\":\"Admin\",\"email\":\"aic.project@wp.pl\"}}";

        const ciphertext = "+64Itj0SzGmhdeg3OdkmF+OgAIUa9MLOLXO+y8TnvL6UK1hkNKhmgC4YvzG2UKY2jP2kImLZrQO9pDf/" +
            "UHL22sA+03r6XAXQGrocsHHE3WxdCU1vHBklZcuZPF7EcRp/rizQxHNGf27erv0e+xIGUg==";
        const decryptedMessage = decrypt(privateKey, publicKey, ciphertext);

        expect(decryptedMessage).toBe(expectedMessage);
    });


    it('Generate key pair', () => {
        expect.assertions(2);

        const keys = generateKeys();

        expect(keys.privateKey).not.toBeNull();
        expect(keys.publicKey).not.toBeNull();
    });
});

