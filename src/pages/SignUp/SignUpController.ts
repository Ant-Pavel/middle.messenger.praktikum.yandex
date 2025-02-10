import authApi, { SignUpRequestData } from '@/api/auth-api';
import Router from '@/utils/Router';

type FormValues = Array<{ name: string, value: string }>;

class LogInController {
  async signUp(formData: FormValues) {
    const dataToSend = Object.fromEntries(formData.map(({ name, value }) => {
      return [name, value];
    }));
    const signUpResponse = await authApi.signUp(dataToSend as SignUpRequestData);
    const { status, response } = signUpResponse as { status: number, response: string };
    if (status === 200) {
      const router = new Router();
      router.go('/');
      return { status, text: '' };
    } if (String(status).startsWith('4')) {
      return { status, text: (JSON.parse(response) as { reason: string }).reason };
    }
  }

  goToLogInPage() {
    const router = new Router();
    router.go('/');
  }
}

export default new LogInController;
