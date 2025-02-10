import { isPlainObject, PlainObject } from './functions';
import Router from './Router';

const METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
} as const ;

interface Options {
  method?: string;
  headers?: Record<string, string>;
  data?: string | Record<string, string | number | boolean | string[]> | FormData;
  disableAnauthorizedRedirect?: boolean;
  timeout?: number;
}

function makeQueryStringFromObject(data: Record<string, string | number | boolean>): string {
  if (typeof data !== 'object') {
    throw new Error('Data must be object');
  }

  const keys = Object.keys(data);
  return keys.reduce((result, key, index) => {
    return `${result}${key}=${data[key]}${index < keys.length - 1 ? '&' : ''}`;
  }, '?');
}

type HTTPMethod = (url: string, options?: Options) => Promise<XMLHttpRequest>;

const host = 'https://ya-praktikum.tech/api/v2';

class HTTPTransport {
  private baseUrl: string;

  constructor(basePath: string) {
    this.baseUrl = host + basePath;
  }

  get: HTTPMethod = (url = '/', options = {}) => {
    const baseUrlGet = this.baseUrl + url;
    const urlWithQueryString = (options.data && isPlainObject(options.data)) ? `${baseUrlGet}${makeQueryStringFromObject(options.data as PlainObject<'string | number | boolean'>)}` : baseUrlGet;
    return this.request(urlWithQueryString, { ...options, method: METHODS.GET }, options.timeout);
  };

  post: HTTPMethod = (url = '/', options = {}) => {
    return this.request(this.baseUrl + url, { ...options, method: METHODS.POST }, options.timeout);
  };

  put: HTTPMethod = (url = '/', options = {}) => {
    return this.request(this.baseUrl + url, { ...options, method: METHODS.PUT }, options.timeout);
  };

  delete: HTTPMethod = (url = '/', options = {}) => {
    return this.request(this.baseUrl + url, { ...options, method: METHODS.DELETE }, options.timeout);
  };

  request = (url: string, options: Options = {}, timeout: number = 5000): Promise<XMLHttpRequest> => {
    const { headers = {}, method, data } = options;

    return new Promise(function (resolve, reject) {
      if (!method) {
        reject('No method');
        return;
      }

      const xhr = new XMLHttpRequest();
      xhr.open(method, url);
      xhr.withCredentials = true;

      Object.keys(headers).forEach(key => {
        xhr.setRequestHeader(key, headers[key]);
      });

      xhr.onload = function () {
        if (xhr.status === 401 && !options.disableAnauthorizedRedirect) {
          (new Router).go('/');
        } else {
          resolve(xhr);
        }
      };

      xhr.onerror = function () {
        reject(xhr);
      };

      xhr.timeout = timeout;
      xhr.ontimeout = function () {
        reject(xhr);
      };

      if (method === METHODS.GET || !data) {
        xhr.send();
      } else {
        xhr.send(data as XMLHttpRequestBodyInit);
      }
    });
  };
}

export default HTTPTransport;
