import Base from './base';
import upload from '@/utils/upload';
export default class Comment extends Base {
    /**
   * 上传图片
   *
   * @static
   * @memberof Data
   */
  static async uploadImage(file) {
    return await upload(file);
  }
  /**
   * 提交评论
   *
   * @static
   * @memberof Data
   */
  static async saveOrderComment({ oid, content, grade, imgList }) {
    return await this.post('/comments/create', {
      oid,
      content,
      grade,
      imgList,
    }, {
      baseURL: this.phpUrl,
    });
  }


  /**
   * 获取评论
   *
   * @static
   * @memberof Comment
   */
  static getProductCommentList({ id }) {
    return this.get('/comments/product', {
      id,
    }, {
      baseURL: this.phpUrl,
    });
  }

  static getIndexRecommend({ uid }) {
    return this.phpGet('/sites', {
      uid: uid || '',
    });
  }
}
