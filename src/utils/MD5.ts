const cryptoJS = require('crypto'); 

/**
 * @description md5 加密 (HEX)
 * @param content 加密的字符串
 * @returns {string} 加密后的字符串
 */
const md5Hex = (content: string)=> cryptoJS.createHash('md5').update(content).digest("hex");

/**
 * @description md5 加密
 * @param content 加密的字符串
 * @returns {string} 全部大写的字符串
 */
const md5HexToUpper = (content: string)=> md5Hex(content).toUpperCase();

/**
 * @description md5 加密
 * @param content 加密的字符串
 * @returns {string} 全部小写的字符串
 */
const md5HexToLower = (content: string)=> md5Hex(content).toLowerCase();

export {md5Hex, md5HexToUpper, md5HexToLower}