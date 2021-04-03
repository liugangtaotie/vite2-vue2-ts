//这里是居民端
import axios from "axios";
import cfg from "./appConfig";
let base = cfg.baseUrl; // 开发的时候

// 目录地址
export const CHILD_URL = base;

// 真趣导航对接
export const NAV_URL =
  "https://nav.mobile.joysuch.com/navigation_HCPort/index.html?buildId=200744&";

const token = JSON.parse(sessionStorage.getItem("userInfo") || "{}");

console.info("token", token);

export const baseImg = () => {
  return cfg.imgPreviewUrl;
};

export const iswx = (urls: any) => {
  const instance = axios.create({
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
  return instance.get(`http://jtys.newhealth.com.cn/auth?url=${urls}`).then((res) => res.data);
};

// 获取下载数据
export const getDownloadInfo = (phoneNo: any, forWhat: string, endType: any) => {
  // endType为1表示医生端，2为居民端
  const instance = axios.create({
    headers: {},
  });
  if (forWhat === "getCount") {
    return instance.get(`${base}/getDownloadCountBySide?side=${endType}`).then((res) => res.data);
  } else {
    return instance
      .get(`${base}/addDownloadLog?side=${endType}&phoneNo=${phoneNo}`)
      .then((res) => res.data);
  }
};

// 获取图片验证码图片
export const getCodeImageInfo = (phoneNo: any, date: any) => {
  const instance = axios.create({
    headers: {},
  });
  return instance
    .get(`${base}/getCheckCodeImg?phoneNo=${phoneNo}&date=${date}`, {
      responseType: "arraybuffer",
    })
    .then((res) => res.data);
};

// 图片请求
export const imgview = (avatarFileId: string) => {
  if (avatarFileId) {
    return `${cfg.imgPreviewUrl}` + avatarFileId;
  }
  return "";
};

// 音频请求
export const voiceUrl = (voiceId: string) => {
  return `${base}/service/chat/voice/` + voiceId;
};

export const imgUploadAjax = (
  formData: any,
  accToken = token ? token.properties.accessToken : ""
) => {
  let instance = axios.create({
    headers: {
      "Content-Type": "multipart/form-data",
      "X-Access-Token": accToken ? accToken : token ? token.properties.accessToken : "",
    },
  });
  return instance.post(`${base}/upload`, formData).then((res) => res.data);
};

// 登录提交保存sessionStorage的accessToken
export const requestLoginon = (params: any) => {
  const instance = axios.create({
    headers: {
      "X-Service-Id": "",
      "X-Service-Method": "",
      "Content-Type": "application/json",
    },
  });
  return instance.post(`${base}/login`, params).then((res) => res.data);
};

// 通用ajax请求方法
export const commonAjax = (params: any, ServiceId: any, ServiceMethod: any) => {
  const instance = axios.create({
    headers: {
      "X-Access-Token": token ? token.properties.accessToken : "",
      "X-Service-Id": ServiceId,
      "X-Service-Method": ServiceMethod,
      "Content-Type": "application/json",
    },
  });
  return instance.post(`${base}/*.jsonRequest`, params).then((res) => res.data);
};

// 个人档案，查看字典
export const personDicAjax = (params: any) => {
  const acctoken = params[1];
  let acctokenTrue = "";
  if (acctoken) {
    acctokenTrue = acctoken;
  } else {
    acctokenTrue = token.properties.accessToken;
  }
  const instance = axios.create({
    headers: {
      "X-Access-Token": acctokenTrue,
      "X-Service-Id": "pcnArchiveVisit.sysDictionaryManageService",
      "X-Service-Method": "queryDictionaryListByCid",
      "Content-Type": "application/json",
    },
  });
  return instance.post(`${base}/*.jsonRequest`, params).then((res) => res.data);
};

// 通用跨域ajax请求方法
export const commonAjaxKy = (params: any, ServiceId: any, ServiceMethod: any) => {
  const instance = axios.create({
    headers: {
      "X-Access-Token": token ? token.properties.accessToken : "",
      "X-Service-Id": ServiceId,
      "X-Service-Method": ServiceMethod,
      "Content-Type": "application/json",
    },
  });
  return instance.post(`${base}/*.jsonRequest`, params).then((res) => res.data);
};

// 居民登陆请求
export const requestLoginon1 = (params: any) => {
  const instance = axios.create({
    headers: {
      "X-Service-Id": "",
      "X-Service-Method": "",
      "Content-Type": "application/json",
    },
  });
  return instance.post(`${base}/logon/login`, params).then((res) => res.data);
};

// 获取验证码
export const getValidation = (params: any, ServiceId: any, ServiceMethod: any) => {
  const instance = axios.create({
    headers: {
      "X-Access-Token": "",
      "X-Service-Id": ServiceId,
      "X-Service-Method": ServiceMethod,
      "Content-Type": "application/json",
    },
  });
  return instance.post(`${base}/*.jsonRequest`, params).then((res) => res.data);
};

// 修改密码
export const requestConfirmPassword = (params: any) => {
  const instance = axios.create({
    headers: {
      "X-Service-Id": "",
      "X-Service-Method": "",
      "Content-Type": "application/json",
    },
  });
  return instance.post(`${base}/modify/pwd`, params).then((res) => res.data);
};

// 密码重置
export const requestChangepwd = (params: any) => {
  let instance = axios.create({
    headers: {
      "X-Service-Id": "",
      "X-Service-Method": "",
      "Content-Type": "application/json",
    },
  });
  return instance.post(`${base}/reset/pwd`, params).then((res) => res.data);
};

// 病历复印内容字典的请求
export const copyContentAjax = () => {
  const instance = axios.create({
    headers: {
      "X-Access-Token": token ? token.properties.accessToken : "",
      "Content-Type": "application/json",
    },
  });
  return instance.get(`${base}/hcn.base.dictionary.bl_copycontent.dic`).then((res) => res.data);
};

// 病历用途字典的请求
export const copyUseAjax = () => {
  const instance = axios.create({
    headers: {
      "X-Access-Token": token ? token.properties.accessToken : "",
      "Content-Type": "application/json",
    },
  });
  return instance.get(`${base}/hcn.base.dictionary.bl_use.dic`).then((res) => res.data);
};

// 地区街道、门牌、单位小区字典的请求
export const areaAjax = (
  params: any,
  accToken = token ? token.properties.accessToken : "",
  sliceType = 3
) => {
  const instance = axios.create({
    headers: {
      "X-Access-Token": accToken ? accToken : token ? token.properties.accessToken : "",
      "Content-Type": "application/json",
    },
  });
  return instance
    .get(`${base}/hcn.base.dictionary.region.dic?parentKey=${params}&sliceType=${sliceType}`)
    .then((res) => res.data);
};

// 地区街道字典的请求
export const areaAjaxCommon = (params: any) => {
  const instance = axios.create({
    headers: {
      "X-Access-Token": token ? token.properties.accessToken : "",
      "Content-Type": "application/json",
    },
  });
  return instance.get(`${base}/hcn.base.dictionary.region.dic?${params}`).then((res) => res.data);
};

// 适用人群的字典请求
export const dicAjax = () => {
  const instance = axios.create({
    headers: {
      "X-Access-Token": token ? token.properties.accessToken : "",
      "Content-Type": "application/json",
    },
  });
  return instance.get(`${base}/pcn.core.dictionary.suitableObject.dic`).then((res) => res.data);
};

// 适用民族字典请求
export const nationalityAjax = () => {
  const instance = axios.create({
    headers: {
      "X-Access-Token": token ? token.properties.accessToken : "",
      "Content-Type": "application/json",
    },
  });
  return instance.get(`${base}/hcn.base.dictionary.GB_T3304.dic`).then((res) => res.data);
};

// 适用人群的字典请求
export const signCancelReasonDicAjax = () => {
  const instance = axios.create({
    headers: {
      "X-Access-Token": token ? token.properties.accessToken : "",
      "Content-Type": "application/json",
    },
  });
  return instance.get(`${base}/pcn.core.dictionary.signCancelReason.dic`).then((res) => res.data);
};

export const residentRegister = (params: any, ServiceId: any, ServiceMethod: any) => {
  const instance = axios.create({
    headers: {
      // "X-Access-Token": JSON.parse(sessionStorage.getItem("userInfo")).properties.accessToken,
      "X-Service-Id": ServiceId,
      "X-Service-Method": ServiceMethod,
      "Content-Type": "application/json",
    },
  });
  return instance.post(`${base}/*.jsonRequest`, params).then((res) => res.data);
};

// 图片的转换
export const imgUrl = (imgId: string) => {
  return baseImg() + imgId;
};

// 修改密码的请求接口
export const requestChangepwd1 = (params: any) => {
  let instance = axios.create({
    headers: {
      "X-Service-Id": "",
      "X-Service-Method": "",
      "Content-Type": "application/json",
    },
  });
  return instance
    .post(
      `${base}/dataProxyController/hcnJsonRequestProxy?short_url=logon/changepwd&params=${params}`
    )
    .then((res) => res.data);
};

// 处方笺支付说明
export const requestRecipePay = (params: any) => {
  let instance = axios.create({
    headers: {
      "X-Access-Token": token ? token.properties.accessToken : "",
      "X-Service-Id": "hcn.baseLevelConfigService",
      "X-Service-Method": "getCopywriterByCode",
      "Content-Type": "application/json",
    },
  });
  return instance
    .post(
      `${base}/dataProxyController/hcnJsonRequestProxy?short_url=logon/changepwd&params=${params}`
    )
    .then((res) => res.data);
};

// 获得健康模板的方法
export const requestJkmoduld = (jkmoduleid: any) => {
  let instance = axios.create({
    headers: {
      "X-Service-Id": "",
      "X-Service-Method": "",
      "Content-Type": "application/json",
    },
  });
  return instance
    .post(`${base}/api/auth/doctor/visitnode/list?t=1&moduleid=10&sign=${jkmoduleid}`)
    .then((res) => res.data);
};

// H5 ajax请求方法
export const commonAjaxH5 = (accToken: any, params: any, ServiceId: any, ServiceMethod: any) => {
  const instance = axios.create({
    headers: {
      "X-Access-Token": accToken ? accToken : "",
      "X-Service-Id": ServiceId,
      "X-Service-Method": ServiceMethod,
      "Content-Type": "application/json",
    },
  });
  return instance.post(`${base}/*.jsonRequest`, params).then((res) => res.data);
};

export const imgUploadAjaxH5 = (accToken: any, formData: any) => {
  let instance = axios.create({
    headers: {
      "Content-Type": "multipart/form-data",
      "X-Access-Token": accToken,
    },
  });
  // return instance.post(`${base}/pcn-core/dataProxyController/hcnImgProxy`, formData).then(res => res.data);
  return instance.post(`${base}/upload`, formData).then((res) => res.data);
};
