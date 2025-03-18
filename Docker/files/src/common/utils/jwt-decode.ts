import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
const encryptionType = process.env.encryptionType || 'AES-128-ECB';
  const decrypt = (data) => {
    var binaryEncryptionKey = Buffer.alloc(16, process.env.encryptionKey, "base64");
    var decipher = crypto.createDecipheriv(encryptionType as string, binaryEncryptionKey, Buffer.alloc(0));
    var decryptedInput = (
      decipher.update(data, "base64", "utf8") +
      decipher.final("utf8")
    );
    return jwt.decode(decryptedInput);
  
  }
  const decryptCookie = (data) => {
    var binaryEncryptionKey = Buffer.alloc(16, process.env.encryptionKey, "base64");
    var decipher = crypto.createDecipheriv(encryptionType as string, binaryEncryptionKey, Buffer.alloc(0));
    var decryptedInput = (
      decipher.update(data, "base64", "utf8") +
      decipher.final("utf8") 
    ); 
    return decryptedInput;
  }

  const encrypt = (data) => {
    console.log(data);
    const binaryEncryptionKey = Buffer.alloc(16, process.env.encryptionKey, 'base64');
    const cipher = crypto.createCipheriv(encryptionType  as string, binaryEncryptionKey, Buffer.alloc(0));
    const encryptedInput = cipher.update(data, 'utf8', 'base64') + cipher.final('base64');
    return encryptedInput;
};
  module.exports = {decrypt,
                    decryptCookie,
                    encrypt
                  }
  