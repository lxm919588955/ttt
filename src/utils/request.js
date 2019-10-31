import Fly from 'flyio/dist/npm/wx';
import config from '@/utils/configs';

const baseUrl = config.baseUrl;
const phpUrl = config.phpUrl;
console.log(phpUrl)

export const request = new Fly();
export const phpRequest = new Fly();

request.config.baseURL = baseUrl;
phpRequest.config.baseURL = phpUrl;

request.interceptors.request.use(requestInterceptors);
request.interceptors.response.use(responseInterceptors, responseErrorInterceptors);

phpRequest.interceptors.request.use(requestInterceptors);
phpRequest.interceptors.response.use(responseInterceptors, responseErrorInterceptors);

function requestInterceptors(request) {
  request.headers = {
    'Content-Type': 'application/json',
    'token': mpvue.getStorageSync('token')
  };
  console.log('请求', request);
  return request;
}

function responseInterceptors(response, promise) {
  console.log('响应', response);
  if (response.data.code == 0) {
    return promise.resolve(response.data);
  } else if (response.data.code == 4001) {
    // 授权已过期
    console.log('接口返回授权已过期，清空token');
    mpvue.removeStorageSync('token');
    mpvue.removeStorageSync('userInfo');
    mpvue.navigateTo({
      url: '/pages/auth/index'
    });
    return promise.reject(response.data);
  } else {
    return promise.reject(response.data);
  }
}

function responseErrorInterceptors(err, promise) {
  console.log(err);
  mpvue.showToast({
    title: err.status + '网络错误',
    icon: 'none',
  });
  return promise.reject();
}
