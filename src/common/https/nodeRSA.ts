/* 
  npm install crypto-js    AES
  npm install node-rsa     RSA 
*/
const EncryptJS = require('jsencrypt'); // RSA加密
const NodeRSA = require('node-rsa'); // RSA 加解密
const CryptoJS = require('crypto-js'); //AES

// 公钥
let pKey = '-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCIW51BVhr3A9pbfIMzeI2/tE3meB1J1upX1LefEJwg/kGjCX3zo+9tEZIBzUtwvoFiEBIR8wvp4ua6IlB/yI+iFEMOc4cqxWF5tLPcuUXZYe3hLKG6ryQx3V4D/y4yibmgJNMH1zMW9QuM/V6Mz0OsP3rmBFL7CMHIwsmFLEPJawIDAQAB-----END PUBLIC KEY-----';

/**【加密】
 * @description 解密返回的Encrypted拿到16为AES密钥
 * @param {*} randomWord -产生任意长度随机字母数字组合
 * @param {*} randomFlag -是否任意长度 min-任意长度最小位[固定位数] max-任意长度最大位
 * @return
 */
 const randomWord = (min: number = 16) => {
  var str = "", range = min, arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

  for (var i = 0; i < range; i++) {
    let pos = Math.round(Math.random() * (arr.length - 1));
    str += arr[pos];
  }

  return str;
}

// 【加密】AES秘钥加盐
const SaltEncrypt = (key: string) => {

  let defaultString = 'abcdefghijklmnopqrstuvwxyz0123456789';

  let index = Math.floor(Math.random() * key.length);

  let saltKey = defaultString.split('')[index];
  let arr2 = key.split('');

  let saltValue = arr2[index];
  arr2[index] = saltKey;
  let result = arr2.join('')

  return result + saltKey + saltValue;
}

// 【解密】- 解密加盐的AES秘钥
const SaltDecrypt = (key: string) => {
  let defaultString = 'abcdefghijklmnopqrstuvwxyz0123456789';

  let lastKey = key.substring(key.length - 2, key.length);
  let firstKey = key.substring(0, key.length - 2);
  let result = lastKey.split('');

  let index = defaultString.indexOf(result[0]); // 位置
  let arr = firstKey.split('');
  arr[index] = result[1];
  let aesKey = arr.join('');

  return aesKey
}

/**【解密】
 * @description 解密返回的Encrypted, 拿到16为AES密钥
 * @return
 */
const RSADecryptEncrypted = (data: string) => {
  let pkey = new NodeRSA(pKey);
  // 解密加盐的AES
  return SaltDecrypt(pkey.decryptPublic(data, "utf-8"))
}

/**【解密】
 * @description 解密 AES密钥
 * @param {*} requestData   -object中返回 data， 用拿到的16位AES密钥解析requestData得到数据
 * @param {*} encrypted     -object中返回 RSA加密的私钥， 需要解析， 拿到16位 AES密钥
 * @param {*} assKey       【1】RSADecryptEncrypted 拿到解密后的AES密钥
 * @param {*} decrypt      【2】CryptoJS 拿到解密后的JSON
 * @return
 */
export const AESDecryptPKey = ({ requestData, encrypted }: { requestData: string, encrypted: string }) => {
  // console.log(requestData);
  // console.log(encrypted);
  
  // key: 16位秘钥  iv: 初始值
  let assKey = RSADecryptEncrypted(encrypted);

  let key = CryptoJS.enc.Utf8.parse(assKey);
  var ivs = CryptoJS.enc.Utf8.parse(assKey);

  var decrypt = CryptoJS.AES.decrypt(requestData, key, {
    iv: ivs,
    mode: CryptoJS.mode.ECB, // 模式
    padding: CryptoJS.pad.Pkcs7
  });
  var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);

  return JSON.parse(decryptedStr.toString());
}

/**【加密】
 * @description 加密传递的数据
 * @param str AES密钥
 * @return  加密后的数据
 */
const AESEncrypt = (str: string, data: any) => {
  // console.log(str);
  var key = CryptoJS.enc.Utf8.parse(str);
  var ivs = CryptoJS.enc.Utf8.parse(str);
  var encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), key, {
    iv: ivs,
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });

  return encrypted.toString();
}

/**【加密】 加密后的密钥
 * @description EncryptJS 加密AES密钥
 * @param str AES密钥
 * @return 
 */
const RSAEncrypt = (str: string) => {
  const encryptor = new EncryptJS.JSEncrypt();
  encryptor.setPublicKey(pKey);    // 设置公钥
  return encryptor.encrypt(str);   // 对需要加密的数据进行加密
}

/**【加密】
 * @description 加密AES密钥和传递的数据
 * @param {*} randomWord 获取16位AES
 * @param {*} key        加盐后的AES秘钥
 * @param {*} data       传递的数据
 * @return
 */
export const encryptData = (data: any) => {
  
  let str = randomWord(16); // 随机生成16位字符串为 AES 密钥
  let key = SaltEncrypt(str); // 加盐

  return {
    requestData: AESEncrypt(str, data),  // 通过AES加密数据
    encrypted: RSAEncrypt(key)  // 加密加盐后的AES密钥
  }
}
