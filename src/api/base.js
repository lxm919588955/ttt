import { request, phpRequest } from '@/utils/request';

export default class Base {

  static get = request.get.bind(request);
  static post = request.post.bind(request);

  static phpGet = phpRequest.get.bind(phpRequest);
  static phpPost = phpRequest.post.bind(phpRequest);
}
