import userApi, { ChangeUserRequestData, ChangePasswordRequestData } from '@/api/user-api';
import authApi from '@/api/auth-api';
import store from '@/utils/Store';
import Router from '@/utils/Router';

export type FormValues = Array<{ name: string, value: string }>;

class ProfileContoller {
  async updateProfileData(data: FormValues) {
    try {
      const dataToSend = Object.fromEntries(data.map(({ name, value }) => {
        return [name, value];
      }));
      const changeUserResponse = await userApi.changeUserInfo(dataToSend as ChangeUserRequestData);
      store.set('userInfo', changeUserResponse);
      store.set('profilePageMode', 'readData');
    } catch (error) {
      console.log(error);
    }
  }

  async updateProfilePassword(data: FormValues) {
    try {
      const dataToSend = Object.fromEntries(data.map(({ name, value }) => {
        return [name, value];
      }));
      await userApi.changeUserPassword(dataToSend as ChangePasswordRequestData);
      store.set('profilePageMode', 'readData');
    } catch (error) {
      console.log(error);
    }
  }

  async updateProfileImage(data: FormData) {
    try {
      const updateProfileImageResponse = await userApi.changeUserAvatar(data);
      store.set('userInfo', updateProfileImageResponse);
    } catch (error) {
      console.log(error);
    }
  }

  async logOut() {
    try {
      const logOutResponse = await authApi.logOut();
      if (logOutResponse === 'OK') {
        const router = new Router();
        router.go('/');
      }
    } catch (error) {
      console.log(error);
    }
  }

  openChatPage() {
    const router = new Router();
    router.go('/messenger');
  }
}

export default new ProfileContoller;
