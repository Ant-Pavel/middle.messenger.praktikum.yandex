import userApi, { ChangeUserRequestData, ChangePasswordRequestData } from '@/api/user-api';
import authApi from '@/api/auth-api';
import store from '@/utils/Store';
import Router from '@/utils/Router';

export type FormValues = Array<{ name: string, value: string }>;

class ProfileController {
  async updateProfileData(data: FormValues) {
    const dataToSend = Object.fromEntries(data.map(({ name, value }) => {
      return [name, value];
    }));
    const changeUserResponse = await userApi.changeUserInfo(dataToSend as ChangeUserRequestData);
    store.set('userInfo', changeUserResponse);
    store.set('profilePageMode', 'readData');
  }

  async updateProfilePassword(data: FormValues) {
    const dataToSend = Object.fromEntries(data.map(({ name, value }) => {
      return [name, value];
    }));
    await userApi.changeUserPassword(dataToSend as ChangePasswordRequestData);
    store.set('profilePageMode', 'readData');
  }

  async updateProfileImage(data: FormData) {
    const updateProfileImageResponse = await userApi.changeUserAvatar(data);
    store.set('userInfo', updateProfileImageResponse);
  }

  async logOut() {
    const logOutResponse = await authApi.logOut();
    if (logOutResponse === 'OK') {
      const router = new Router();
      router.go('/');
    }
  }

  openChatPage() {
    const router = new Router();
    router.go('/messenger');
  }
}

export default new ProfileController;
