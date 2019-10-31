export default class Http {
  static request(method, url, data, loading, header) {
    if (loading) {
      wx.showLoading({
        title: '加载中',
      });
    }
    return new Promise((resolve, reject) => {
      wx.request({
        url,
        data: {
          ...data,
        },
        method,
        header: {
          'Content-Type': 'application/json',
        },
        success(res) {
          if (res.statusCode === 200) {
            if (res.data.status == 200) {
              resolve(res.data);
            } else {
              reject(res.data);
            }
          } else {
            reject(res.data);
          }
        },
        fail(res) {
          reject(res)
        },
        complete(res) {
          if (loading) {
            wx.hideLoading();
          }
        },
      });
    });
  }

  static get (url, data, loading, header) {
    return this.request('GET', url, data, loading, header);
  }

  static put (url, data, loading, header) {
    return this.request('PUT', url, data, loading, header);
  }

  static post (url, data, loading, header) {
    return this.request('POST', url, data, loading, header);
  }

  static patch (url, data, loading, header) {
    return this.request('PATCH', url, data, loading, header);
  }

  static delete (url, data, loading, header) {
    return this.request('DELETE', url, data, loading, header);
  }
}
