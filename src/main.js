import { profile, signIn, logIn, navigationList, chatList } from './mockData.js';
import Handlebars from 'handlebars';
import './css/main.pcss';
import './components/menu/menu.pcss';

import avatarImgUrl from './assets/images/emptyAvatar.jpeg';
chatList.forEach(cl => cl.avatarImgUrl = avatarImgUrl);

//Screen
import { Profile, ChangeProfileData, ChangeProfilePassword, ChangeProfileAvatar } from './pages/Profile';
import { SignIn } from './pages/SignIn';
import { LogIn } from './pages/LogIn';
import { Chat, ChatSearch, ChatFunctions, ChatNotSelected } from './pages/Chat';
import { Page500 } from './pages/Page500';
import { Page404 } from './pages/Page404';

//Components
import { Modal as ModalDummy } from './components/modal';
import { FormControl } from './components/formControl';
import { Button } from './components/button';
import { ActionLink } from './components/actionLink';

//Partials
import ProfileTable from './partials/ProfileTable.hbs?raw';
import ProfileSidebarBack from './partials/ProfileSidebarBack.hbs?raw';
import ProfileAvatar from './partials/ProfileAvatar.hbs?raw';
import PagesNavigation from './partials/PagesNavigation.hbs?raw';
import ChatList from './partials/ChatList.hbs?raw';

const templates = {
    Profile: Handlebars.compile(Profile),
    ChangeProfileData: Handlebars.compile(ChangeProfileData),
    ChangeProfilePassword: Handlebars.compile(ChangeProfilePassword),
    ChangeProfileAvatar: Handlebars.compile(ChangeProfileAvatar),
    Chat: Handlebars.compile(Chat),
    SignIn: Handlebars.compile(SignIn),
    LogIn: Handlebars.compile(LogIn),
    Page404: Handlebars.compile(Page404),
    Page500: Handlebars.compile(Page500),
    ChatSearch: Handlebars.compile(ChatSearch),
    ChatFunctions: Handlebars.compile(ChatFunctions),
    ChatNotSelected: Handlebars.compile(ChatNotSelected),
};

Handlebars.registerPartial('ProfileTable', ProfileTable);
Handlebars.registerPartial('ProfileSidebarBack', ProfileSidebarBack);
Handlebars.registerPartial('ProfileAvatar', ProfileAvatar);
Handlebars.registerPartial('ModalDummy', ModalDummy);
Handlebars.registerPartial('Button', Button);
Handlebars.registerPartial('FormControl', FormControl);
Handlebars.registerPartial('ActionLink', ActionLink);
Handlebars.registerPartial('PagesNavigation', PagesNavigation);
Handlebars.registerPartial('ChatList', ChatList);


let currentPage = 'LogIn';

function render() {
    const app = document.getElementById('app');
    app.innerHTML = templates[currentPage]({ profile, signIn, logIn, chatList, avatarImgUrl, navigationList });
    attachEventListeners();
}

function attachEventListeners() {
    if (currentPage === 'Profile') {
        const profileChangeInfoBtn = document.getElementById('profileChangeInfoBtn');
        const profileChangePasswordBtn = document.getElementById('profileChangePasswordBtn');
        const profileAvatarImg = document.getElementById('profileAvatarImg');
        const profileSidebarBack = document.getElementById('profileSidebarBack');

        profileChangeInfoBtn.addEventListener('click', function(e) {
            currentPage = 'ChangeProfileData';
            render();
        });

        profileChangePasswordBtn.addEventListener('click', function(e) {
            currentPage = 'ChangeProfilePassword';
            render();
        });

        profileAvatarImg.addEventListener('click', function () {
            currentPage = 'ChangeProfileAvatar';
            render();
        });

        profileSidebarBack.addEventListener('click', function() {
            currentPage = 'Chat';
            render();
        });
    }

    if (currentPage === 'ChangeProfileData' || currentPage === 'ChangeProfilePassword') {
        const profileSidebarBack = document.getElementById('profileSidebarBack');
        const profileSaveBtn = document.getElementById('profileSaveBtn');

        const formInputWraps = document.querySelectorAll('.formControl')
        const removeListenersF = addEventListenersToInputs(Array.from(formInputWraps), 'formControl');

        profileSaveBtn.addEventListener('click', function(e) {
            e.preventDefault();
        });

        profileSidebarBack.addEventListener('click', function(e) {
            const removeListenersF = addEventListenersToInputs(Array.from(formInputWraps), 'formControl');
            currentPage = 'Profile';
            render();
        });
    }

    if (currentPage === 'ChangeProfileAvatar') {
        const dialogOverlay = document.querySelector('.dialog__overlay');

        dialogOverlay.addEventListener('click', function(e) {
            currentPage = 'Profile';
            render();
        });
    }

    if (currentPage === 'SignIn') {
        const signInBtn = document.getElementById('signInBtn');
        const signInEntranceLink = document.getElementById('signInEntranceLink');

        const formInputWraps = document.querySelectorAll('.formControl')
        const removeListenersF = addEventListenersToInputs(Array.from(formInputWraps), 'formControl');

        signInBtn.addEventListener('click', function(e) {
            e.preventDefault();
        });

        signInEntranceLink.addEventListener('click', function(e) {
            removeListenersF();
            currentPage = 'Chat';
            render();
        });
    }


    if (currentPage === 'LogIn') {
        const logInBtn = document.getElementById('logInBtn');
        const loginInNoAccountLink = document.getElementById('loginInNoAccountLink');

        const formInputWraps = document.querySelectorAll('.formControl')
        const removeListenersF = addEventListenersToInputs(Array.from(formInputWraps), 'formControl');

        logInBtn.addEventListener('click', function(e) {
            e.preventDefault();
            removeListenersF();
            currentPage = 'Chat';
            render();
        });

        loginInNoAccountLink.addEventListener('click', function(e) {
            removeListenersF();
            currentPage = 'SignIn';
            render();
        });
    }

    if (currentPage === 'Page404') {
        const page404Homelink = document.getElementById('page404Homelink');

        page404Homelink.addEventListener('click', function(e) {
            currentPage = 'Chat';
            render();
        });
    }

    if (currentPage === 'Page500') {
        const page500Homelink = document.getElementById('page500Homelink');

        page500Homelink.addEventListener('click', function(e) {
            currentPage = 'Chat';
            render();
        });
    }

    if (currentPage === 'Chat' || currentPage === 'ChatSearch' || currentPage === 'ChatFunctions' || currentPage === 'ChatNotSelected') {
        const searchInputWrap = document.querySelector('.searchInput__wrap');

        const removeListenersF = addEventListenersToInputs([searchInputWrap], 'searchInput__wrap');

        const chatProfileLink = document.getElementById('chatProfileLink');
        chatProfileLink.addEventListener('click', function(e) {
            removeListenersF();
            currentPage = 'Profile';
            render();
        });
    }

    Array.from(document.querySelectorAll('.actionLink')).forEach(anchorEl => {
        anchorEl.addEventListener('click', function() {
            currentPage = anchorEl.dataset.link;
            render();
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    render();
});

function addEventListenersToInputs(inputsWraps = [], prefix) {
    const listenersArr = [];
    inputsWraps.forEach(inputWrap => {
        const input = inputWrap.querySelector('input');
        if (input.value) {
            inputWrap.classList.add(`${prefix}--hasValue`);
        }

        const focusCbk = function() {
            inputWrap.classList.add(`${prefix}--focused`);
        };

        const blurCbk = function() {
            inputWrap.classList.remove(`${prefix}--focused`);
            if (!input.value) {
                inputWrap.classList.remove(`${prefix}--hasValue`);
            } else {
                inputWrap.classList.add(`${prefix}--hasValue`);
            }
        }

        input.addEventListener('focus', focusCbk);
        input.addEventListener('blur', blurCbk);

        listenersArr.push({input, focusCbk, blurCbk});
    });

    return function removeListeners() {
        console.log('remove call');
        listenersArr.forEach(({input, focusCbk, blurCbk}) => {
            input.removeEventListener('focus', focusCbk);
            input.removeEventListener('blur', blurCbk);
        });
    }
}
