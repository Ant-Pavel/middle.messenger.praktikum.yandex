import { profile, signIn, logIn, navigationList, chatList } from './mockData';

import Profile from './pages/Profile';
import ChangeProfileData from './pages/ChangeProfileData';
import Chat from './pages/Chat';
import SignIn from './pages/SignIn';
import LogIn from './pages/LogIn';
import Page404 from './pages/Page404';
import Page500 from './pages/Page500';
import ChangeProfilePassword from './pages/ChangeProfilePassword';

let currentPage = 'ChangeProfileData';

function changePage(pageId: string) {
  currentPage = pageId;
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  render();
}


function render() {
  const app = document.getElementById('app') as HTMLDivElement;
  let page;

  const commonProps = {
    navigationList,
    changePage,
  };

  if (currentPage === 'Profile') {
    const { actions: profileActions, fields: profileFields } = profile;
    page = new Profile({ profileActions, profileFields, ...commonProps });
  } else if (currentPage === 'ChangeProfileData') {
    const { changeProfileInfoControls } = profile;
    page = new ChangeProfileData({ changeProfileInfoControls, ...commonProps });
  } else if (currentPage === 'ChangeProfilePassword') {
    const { changeProfilePasswordControls } = profile;
    page = new ChangeProfilePassword({ changeProfilePasswordControls, ...commonProps });
  } else if (currentPage === 'Chat') {
    page = new Chat({ chatList, ...commonProps });
  } else if (currentPage === 'SignIn') {
    page = new SignIn({ signInControls: signIn.controls, ...commonProps });
  } else if (currentPage === 'LogIn') {
    page = new LogIn({ logInControls: logIn.controls, ...commonProps });
  } else if (currentPage === 'Page404') {
    page = new Page404({ ...commonProps });
  } else if (currentPage === 'Page500') {
    page = new Page500({ ...commonProps });
  }

  if (!page) return;

  if (app.firstElementChild) {
    app.firstElementChild.replaceWith(page.getContent());
  } else {
    app.appendChild(page.getContent());
  }
}


document.addEventListener('DOMContentLoaded', () => {
  render();
});
