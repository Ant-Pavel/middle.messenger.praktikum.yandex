import './chat.pcss';
import Block from '../../utils/Block';
import rawTemplate from './Chat.hbs?raw';
import ChatPlank,  { type ChatPlankProps } from '../../components/chatPlank';
import ChatMsgGroup from '../../components/chatMsgGroup';
import chatMsgForm from '../../components/chatMsgForm';
import PagesNavigation from '../../components/pagesNavigation';
import Menu from '../../components/menu';

type ChatProps = {
  chatList: (Omit<ChatPlankProps, 'chatItemClick'>)[]
  changePage: (pageId: string) => void,
  navigationList: ((ConstructorParameters<typeof PagesNavigation>)[0])['navigationList']
};

const appendMenu = new Menu({
  attrs: {
    style: 'bottom: 75px; left: 310px;',
  },
  items: [
    { icon: 'mediaIcon', name: 'Фото или Видео' },
    { icon: 'folderIcon', name: 'Файл' },
    { icon: 'locationIcon', name: 'Локация' },
  ],
});

const chatUsersMenu = new Menu({
  attrs: {
    style: 'right: 10px; top: 80px;',
  },
  items: [
    { icon: 'plusIcon', name: 'Добавить пользователя' },
    { icon: 'crossIcon', name: 'Удалить пользователя' },
  ],
});

const toggleAppendMenu = () => {
  appendMenu.getContent().classList.toggle('menu__wrap--shown');
};

const toggleChatUsersMenu = () => {
  chatUsersMenu.getContent().classList.toggle('menu__wrap--shown');
};

export default class Chat extends Block {
  constructor(props: ChatProps) {
    const chatItemClick = (event: Event) => {
      const { dataid } = (event.currentTarget as HTMLElement).dataset;
      const chatListCopy = JSON.parse(JSON.stringify(props.chatList)) as ChatProps['chatList'];
      chatListCopy.forEach((item) => {
        item.isActive = item.id === dataid;
      });

      this.setLists({
        chatList: chatListCopy.map((chatItemInfo) => {
          return new ChatPlank({ ...chatItemInfo, chatItemClick });
        }),
      });
    };

    super({
      ...props,
      chatList: props.chatList.map((chatItemInfo) => {
        const a = {
          ...chatItemInfo,
          chatItemClick,
        };
        return new ChatPlank(a);
      }),
      chatGroups: [
        new ChatMsgGroup({
          date: '19 июня',
          messages: [
            {
              type: 'text',
              time: '11:56',
              content: `<p>Привет! Смотри, тут всплыл интересный кусок лунной космической истории — НАСА в какой-то момент
                        попросила Хассельблад адаптировать модель SWC для полетов на Луну. Сейчас мы все знаем что
                        астронавты летали с моделью 500 EL — и к слову говоря, все тушки этих камер все еще находятся на
                        поверхности Луны, так как астронавты с собой забрали только кассеты с пленкой.</p>
                        <p>Хассельблад в итоге адаптировал SWC для космоса, но что-то пошло не так и на ракету они так
                        никогда и не попали. Всего их было произведено 25 штук, одну из них недавно продали на аукционе
                        за 45000 евро.</p>`,
              status: 'sent',
              isMine: false,
            },
            {
              type: 'image',
              time: '18:23',
              src: 'https://imgcdn.stablediffusionweb.com/2024/2/24/e6379db8-e816-4528-801f-0e20647245d3.jpg',
              status: 'sent',
              isMine: false,
            },
            {
              type: 'text',
              time: '18:23',
              content: 'Круто!',
              status: 'sent',
              isMine: true,
            },
          ],
        }),
      ],
      chatMsgForm: new chatMsgForm({
        onAppendBtnClick: () => {
          toggleAppendMenu();
        },
      }),
      appendMenu,
      chatUsersMenu,
      chatSearchInputLabel: 'Поиск',
      chatSearchInputValue: '',
      avatarImgUrl: './images/dummy.jpg',
      events: {
        'chatMenuBtn.click': () => {
          toggleChatUsersMenu();
        },
        'chatSearchInput.focus': () => {
          (this.getContent().querySelector('.searchInput__wrap') as HTMLElement).classList.add('searchInput__wrap--focused');
        },
        'chatSearchInput.blur': (event: Event) => {
          (this.getContent().querySelector('.searchInput__wrap') as HTMLElement).classList.remove('searchInput__wrap--focused');
          if ((event.target as HTMLInputElement).value) {
            (this.getContent().querySelector('.searchInput__wrap') as HTMLElement).classList.add('searchInput__wrap--hasValue');
          } else {
            (this.getContent().querySelector('.searchInput__wrap') as HTMLElement).classList.remove('searchInput__wrap--hasValue');
          }
        },
        'profileLink.click': () => {
          props.changePage('Profile');
        },
      },
      pagesNavigation: new PagesNavigation({ navigationList: props.navigationList, changePage: props.changePage }),
    });
  }

  render() {
    return rawTemplate;
  }
}
