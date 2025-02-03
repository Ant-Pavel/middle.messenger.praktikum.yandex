import store from '@/utils/Store';
import authApi, { SignInRequestData } from '@/api/auth-api';
import Router from '@/utils/Router';

type FormValues = Array<{ name: string, value: string }>;

class LogInController {

  async logIn(formData: FormValues) {
    try {
      const dataToSend = Object.fromEntries(formData.map(({ name, value }) => {
        return [name, value];
      }));
      const signInResponse = await authApi.signIn(dataToSend as SignInRequestData);
      if (signInResponse === 200) {
        const getUserResponse = await authApi.getUser();
        store.set('userInfo', getUserResponse);
        const router = new Router();
        router.go('/settings');
      }
      return signInResponse;
    } catch (error) {
      console.log(error);
    }
  }

  goToSignUpPage() {
    const router = new Router();
    router.go('/sign-up');
  }
}

export default new LogInController;
