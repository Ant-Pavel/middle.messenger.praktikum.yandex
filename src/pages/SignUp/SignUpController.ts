import authApi, { SignUpRequestData } from '@/api/auth-api';
import Router from '@/utils/Router';

type FormValues = Array<{ name: string, value: string }>;

class LogInController {
  async signUp(formData: FormValues) {
    try {
      const dataToSend = Object.fromEntries(formData.map(({ name, value }) => {
        return [name, value];
      }));
      const res: XMLHttpRequest = await authApi.signUp(dataToSend as SignUpRequestData);
      if (res.status === 200) {
        const router = new Router();
        router.go('/');
        return { status: res.status, responseObj: JSON.parse((res.response as string)) as { id: string } };
      }
      return { status: res.status, responseObj: JSON.parse((res.response as string)) as { reason: string } };
    } catch (error) {
      console.log(error);
    }
  }
}

export default new LogInController;
