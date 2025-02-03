
import store from '@/utils/Store';
import userApi from '@/api/user-api';

class AddUserController {
  async searchUsers(login: string) {
    if (login) {
      const searchUsersRes = await userApi.searchUsers(login);
      store.set('searchUsersList', searchUsersRes);
    } else {
      this.resetUsersList();
    }
  }

  resetUsersList() {
    store.set('searchUsersList', []);
  }
}

export default new AddUserController;
