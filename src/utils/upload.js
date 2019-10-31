import configs from './configs';
function uploadImage(file) {
  return new Promise((resolve, reject) => {
    mpvue.uploadFile({
      url: `${configs.phpUrl}/sites/upload`,
      filePath: file,
      name: 'file',
      header: {
        'token': mpvue.getStorageSync('token')
      },
      success(res) {
        console.log(res);
        if (res.statusCode == 200) {
          const data = JSON.parse(res.data);
          if (data.code === 0) {
            resolve(data);
          } else {
            reject(data);
          }
        } else {
          reject();
        }
      },
      fail(err) {
        reject(err);
      }
    });
  });
}

export default uploadImage;
