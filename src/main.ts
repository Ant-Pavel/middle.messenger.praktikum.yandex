import Router from '@/utils/Router';
import { profile, signUp, logIn } from './mockData';
import store from '@/utils/Store';
import authApi from './api/auth-api';
import Profile from './pages/Profile';
import Chat from './pages/Chat';
import SignUp from './pages/SignUp';
import LogIn from './pages/LogIn';

const commonProps = {
  changePage: () => { },
};

document.addEventListener('DOMContentLoaded', async () => {
  const getUserResponse = await authApi.getUser();

  const router = new Router('#app');
  router
    .use('/', LogIn, { logInControls: logIn.controls, ...commonProps })
    .use('/sign-up', SignUp, { signUpControls: signUp.controls, ...commonProps })
    .use('/messenger', Chat)
    .use('/settings', Profile, { profileActions: profile.actions, profileFields: profile.fields, changeProfilePasswordControls: profile.changeProfilePasswordControls, changeProfileInfoControls: profile.changeProfileInfoControls, ...commonProps })
    .start();

  if (getUserResponse && getUserResponse.id) {
    store.set('userInfo', getUserResponse);
    store.set('profileTableData', store.getState().profileControls.map(({ inputName, label }) => {
      return {
        name: label,
        value: getUserResponse[inputName as keyof typeof getUserResponse]
      };
    }));
    if (window.location.pathname === '/') {
      router.go('/messenger');
    }
  } else if (window.location.pathname !== '/sign-up') {
    router.go('/');
  }
});
