/**
 *  IP 信息
 */
let baseUrl, imageUrl;

// const devUrl = "http://pfecfm.natappfree.cc";
const devUrl = "https://houseofwinners.com";
const prodUrl = "https://houseofwinners.com";

switch (process.env.NODE_ENV) {
  case "development":

    baseUrl = devUrl + "/wcw-project";
    imageUrl = devUrl + "/wcw-project/";
    break
  case "production":

    baseUrl = prodUrl + "/wcw-project";
    imageUrl = prodUrl + "/wcw-project/";
    break
}

export { baseUrl, imageUrl }