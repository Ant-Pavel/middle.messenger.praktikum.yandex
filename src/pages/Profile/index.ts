import './profile.pcss';
import SidebarArrowLink from '../../components/sidebarArrowLink';
import ProfileAvatar from '../../components/profileAvatar';
import ProfileTable from '../../components/profileTable';
import ProfileAction from '../../components/profileAction';
import ModalLink from '../../components/modalLink';
import PagesNavigation from '../../components/pagesNavigation';
import Block from '../../utils/Block';
import rawTemplate from './Profile.hbs?raw';


type ProfileProps = {
  profileFields: ((ConstructorParameters<typeof ProfileTable>)[0])['fields'],
  profileActions: ((ConstructorParameters<typeof ProfileAction>)[0])[]
  changePage: (pageId: string) => void,
  navigationList: ((ConstructorParameters<typeof PagesNavigation>)[0])['navigationList']
};

export default class Profile extends Block {
  constructor(props: ProfileProps) {
    super({
      ...props,
      sidebarArrowLink: new SidebarArrowLink({
        href: '#',
        events: {
          'click': function (event: Event) {
            event.preventDefault();
            props.changePage('Profile');
          },
        },
      }),
      profileAvatar: new ProfileAvatar({
        changeAvatarText: 'Сменить аватар',
        avatarName: 'Иван Иванов',
        events: {
          'image.click': () => {
            const modalComponent = this.children.modal;
            if (modalComponent) modalComponent.show();
          },
        },
      }),
      profileTable: new ProfileTable({
        fields: props.profileFields,
      }),
      profileActions: props.profileActions.map(({ id, text, link }) => new ProfileAction({
        id, text, link,
        events: {
          click: function (event: Event) {
            event.preventDefault();
            const pageId = (event.target as HTMLElement).dataset.link;
            if (pageId) {
              props.changePage(pageId);
            }
          },
        },
      })),
      modal: new ModalLink({
        publicId: 'modal',
        header: 'Загрузите файл',
        actionLinkText: 'Выбрать файл на компьютере',
        hint: 'Нужно выбрать файл',
        btnText: 'Поменять',
        events: {
          'overlay.click': (event: Event) => {
            if (event.target !== event.currentTarget) return;
            const modalComponent = this.children.modal;
            if (modalComponent) modalComponent.hide();
          },
        },
      }),
      pagesNavigation: new PagesNavigation({ navigationList: props.navigationList, changePage: props.changePage }),
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
