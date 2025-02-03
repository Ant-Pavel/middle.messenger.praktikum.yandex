import HTTP from '@/utils/HTTPTransport';

const userApiHTTP = new HTTP('/user');

export type ChangeUserRequestData = {
  'first_name': string,
  'second_name': string,
  'display_name': string,
  'login': string,
  'email': string,
  'phone': string
};

export type ChangePasswordRequestData = {
  'oldPassword': string;
  'newPassword': string;
};

export type ChangeUserResponse = {
  'id': 123,
  'first_name': string;
  'second_name': string;
  'display_name': string;
  'phone': string;
  'login': string;
  'avatar': string;
  'email': string;
};

class UserApi {
  async changeUserInfo(data: ChangeUserRequestData) {
    const res = await userApiHTTP.put('/profile', {
      data: JSON.stringify(data),
      headers: {
        'content-type': 'application/json'
      }
    });

    return JSON.parse(res.response as string) as ChangeUserResponse;
  }

  async changeUserPassword(data: ChangePasswordRequestData) {
    const res = await userApiHTTP.put('/password', {
      data: JSON.stringify(data),
      headers: {
        'content-type': 'application/json'
      }
    });
    return res.response as string;
  }

  async changeUserAvatar(data: FormData) {
    const res = await userApiHTTP.put('/profile/avatar', {
      data
    });
    return JSON.parse(res.response as string) as ChangeUserResponse;
  }

  async searchUsers(login: string) {
    const res = await userApiHTTP.post('/search', {
      data: JSON.stringify({ login }),
      headers: {
        'content-type': 'application/json'
      }
    });
    return JSON.parse(res.response as string) as ChangeUserResponse;
  }
}

export default new UserApi;
