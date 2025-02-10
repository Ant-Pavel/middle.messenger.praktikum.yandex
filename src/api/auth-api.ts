import HTTP from '@/utils/HTTPTransport';
import { ChangeUserResponse } from './user-api';

const authApiHTTP = new HTTP('/auth');

export type SignUpRequestData = {
  'first_name': string,
  'second_name': string,
  'login': string,
  'email': string,
  'password': string,
  'phone': string
};


export type SignInRequestData = {
  'login': string,
  'password': string
};

class AuthApi {
  async signUp(data: SignUpRequestData) {
    const res = await authApiHTTP.post('/signup', {
      data: JSON.stringify(data),
      headers: {
        'content-type': 'application/json'
      },
    });
    return res;
  }

  async signIn(data: SignInRequestData) {
    const res = await authApiHTTP.post('/signin', {
      data: JSON.stringify(data),
      headers: {
        'content-type': 'application/json'
      },
      disableAnauthorizedRedirect: true

    });
    return res;
  }

  async logOut() {
    const res = await authApiHTTP.post('/logout');
    return res.response as string;
  }

  async getUser() {
    const res = await authApiHTTP.get('/user', {
      disableAnauthorizedRedirect: true
    });
    return JSON.parse(res.response as string) as ChangeUserResponse;
  }
}

export default new AuthApi;


