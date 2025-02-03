import './profile.pcss';
import SidebarArrowLink from '../../components/sidebarArrowLink';
import ProfileAvatar from '../../components/profileAvatar';
import ProfileTable from '../../components/profileTable';
import ChangeProfileAvatarModal from '../../components/modals/addFile';
import Profile_changeData from '../../components/profile_changeData';
import Profile_readData from '../../components/profile_readData';
import Profile_changePassword from '../../components/profile_changePassword';
import Block from '../../utils/Block';
import rawTemplate from './Profile.hbs?raw';
import connect from '@/utils/connectStoreToComponent';
import FormControl from '../../components/formControl';
import store from '@/utils/Store';
import profileController, { FormValues } from './ProfileController';


type ProfileProps = {
  changeProfileInfoControls: ((ConstructorParameters<typeof FormControl>)[0])[],
  changeProfilePasswordControls: ((ConstructorParameters<typeof FormControl>)[0])[],
  profileFields: ((ConstructorParameters<typeof ProfileTable>)[0])['fields']
};

class Profile extends Block {
  constructor(props: ProfileProps) {
    super({
      ...props,
      sidebarArrowLink: new SidebarArrowLink({
        href: '#',
        events: {
          'click': function (event: Event) {
            event.preventDefault();
            const currentMode = store.getState().profilePageMode;
            if (currentMode === 'changeData' || currentMode === 'changePassword') {
              store.set('profilePageMode', 'readData');
            } else if (currentMode === 'readData') {
              profileController.openChatPage();
            }
          },
        },
      }),
      profileAvatar: new ProfileAvatar({
        changeAvatarText: 'Сменить аватар',
        avatarName: store.getState().userInfo ? `${store.getState().userInfo?.first_name} ${store.getState().userInfo?.second_name}` : '',
        avatarImage: (store.getState().userInfo && store.getState()?.userInfo?.avatar) ? `${store.getState().resourcesBasePath}${store.getState()?.userInfo?.avatar}` : '',
        events: {
          'image.click': () => {
            const modalComponent = this.children.modal;
            if (modalComponent) modalComponent.show();
          },
        }
      }),
      mode: store.getState().profilePageMode,
      readDataTab: new Profile_readData({
        profileFields: props.profileFields,
        profileActions: [
          {
            id: 'profileChangeInfoBtn',
            text: 'Изменить данные',
            color: 'blue',
            actionClickHandler: (event: Event) => {
              event.preventDefault();
              console.log('profileChangeInfoBtn ');
              store.set('profilePageMode', 'changeData');
            }
          },
          {
            id: 'profileChangePasswordBtn',
            text: 'Изменить пароль',
            color: 'blue',
            actionClickHandler: (event: Event) => {
              event.preventDefault();
              store.set('profilePageMode', 'changePassword');
            }
          },
          {
            id: '',
            text: 'Выйти',
            color: 'red',
            actionClickHandler: async (event: Event) => {
              event.preventDefault();
              await profileController.logOut();
            }
          },
        ]
      }),
      changeDataTab: new Profile_changeData({
        changeProfileInfoControls: props.changeProfileInfoControls,
        saveDataHandler: async (data: FormValues) => {
          await profileController.updateProfileData(data);
        }
      }),
      changePasswordTab: new Profile_changePassword({
        changeProfilePasswordControls: props.changeProfilePasswordControls,
        saveDataHandler: async (data) => {
          await profileController.updateProfilePassword(data);
        }
      }),
      modal: new ChangeProfileAvatarModal({
        publicId: 'modal',
        actionLinkText: 'Выбрать файл на компьютере',
        btnText: 'Поменять',
        fileInputName: 'avatar',
        addFileModalHandler: async (formData) => {
          await profileController.updateProfileImage(formData);
          this.children.modal.reset();
          this.children.modal.hide();
        }
      }),
      // pagesNavigation: new PagesNavigation({ navigationList: props.navigationList, changePage: props.changePage }),
    });
  }

  componentDidMount() {
    const modalComponent = this.children.modal;
    if (modalComponent) modalComponent.hide();
  }

  render() {
    return rawTemplate;
  }
}

export default connect(Profile, (state) => ({
  mode: state.profilePageMode
}));
