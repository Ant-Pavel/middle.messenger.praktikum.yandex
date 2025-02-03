import './chat.pcss';
import Block, { Props } from '../../utils/Block';
import rawTemplate from './Chat.hbs?raw';
import ChatPlankList from '@/components/chatPlankList';
import ChatMsgList from '@/components/chatMsgList';
import chatMsgForm from '../../components/chatMsgForm';
import Menu from '../../components/menu';
import addChatModal from '@/components/modals/addChat';
import DeleteChatModal from '@/components/modals/deleteChat';
import DeleteUserModal from '@/components/modals/deleteUser';
import addUserModal from '@/components/modals/addUser';
import addFileModal from '../../components/modals/addFile';
import ChatController from './ChatController';
import connect from '@/utils/connectStoreToComponent';
import { StoreState } from '@/utils/Store';
import Router from '@/utils/Router';


class Chat extends Block {
  constructor(props: Props) {
    super({
      ...props,
      chatPlankList: new ChatPlankList({}),
      // store.getState().chatList.map((a) => {
      //   console.log('this123 ', this);
      //   return new ChatPlank({ ...a, chatItemClick: chatItemClick.bind(this) });
      // }),
      chatMsgList: new ChatMsgList({}),
      chatMsgForm: new chatMsgForm({
        sendMsgHandler: (msg: string) => {
          ChatController.sendMessage(msg);
        },
        onAppendBtnClick: (event: Event) => {
          event.stopPropagation();
          this.hideAllMenus();
          this.children.appendFileMenu.toggleVisibility();
        },
      }),
      appendFileMenu: new Menu({
        attrs: {
          style: 'bottom: 75px; left: 310px;',
        },
        items: [
          { icon: 'mediaIcon', name: 'Изображение', id: 'loadPhoto' }
        ],
        events: {
          'loadPhoto.click': () => {
            this.children.appendFileMenu.hide();
            this.children.uploadImageMsgModal.show();
          },
        }
      }),
      chatUsersMenu: new Menu({
        attrs: {
          style: 'right: 10px; top: 80px;',
        },
        items: [
          { icon: 'plusIcon', name: 'Добавить пользователя', id: 'addUserItem' },
          { icon: 'crossIcon', name: 'Удалить пользователя', id: 'deleteUserItem' },
        ],
        events: {
          'addUserItem.click': () => {
            this.children.chatUsersMenu.hide();
            this.children.addUserModal.show();
          },
          'deleteUserItem.click': () => {
            this.children.chatUsersMenu.hide();
            this.children.deleteUserModal.show();
          }
        }
      }),
      chatListMenu: new Menu({
        attrs: {
          style: 'left: 45px; top: 20px;',
        },
        items: [
          { icon: 'plusIcon', name: 'Добавить чат', id: 'addChatItem' },
          { icon: 'crossIcon', name: 'Удалить чат', id: 'deleteChatItem' },
        ],
        events: {
          'addChatItem.click': () => {
            this.children.chatListMenu.hide();
            this.children.addChatModal.show();
          },
          'deleteChatItem.click': () => {
            this.children.chatListMenu.hide();
            this.children.deleteChatModal.show();
          }
        }
      }),
      chatSearchInputLabel: 'Поиск',
      chatSearchInputValue: '',
      events: {
        'click': (event: Event) => {
          const isClickInsideMenu = (event.target as HTMLElement).closest('.menu__wrap') !== null;
          if (isClickInsideMenu) return;
          this.hideAllMenus();
        },
        'chatUsersMenuBtn.click': (event: Event) => {
          event.stopPropagation();
          this.hideAllMenus();
          this.children.chatUsersMenu.toggleVisibility();
        },
        'chatListMenuBtn.click': (event: Event) => {
          event.stopPropagation();
          this.hideAllMenus();
          this.children.chatListMenu.show();
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
          (new Router).go('/settings');
        },
        'addChatBtn.click': () => {
          const addChatModalComponent = this.children.addChatModal;
          if (addChatModalComponent) addChatModalComponent.show();
        }
      },
      addChatModal: new addChatModal({
        header: 'Добавить новый чат',
        btnText: 'Добавить',
        btnClickHandler: async (chatName: string) => {
          await ChatController.createChat(chatName);
          await ChatController.getChats();
        }
      }),
      addUserModal: new addUserModal({
        header: 'Добавить пользователя в чат',
        btnText: 'Добавить',
        btnClickHandler: async (id: string) => {
          await ChatController.addUserToChat(id);
          await ChatController.updateCurrentChatUsers();
        }
      }),
      deleteUserModal: new DeleteUserModal({
        header: 'Удаление пользователя из чата',
        btnText: 'Удалить',
        btnClr: 'orange',
        itemSelectorHint: 'Выберите пользователя',
        btnClickHandler: async (id: string) => {
          await ChatController.deleteUserFromChat(id);
          await ChatController.updateCurrentChatUsers();
        }
      }),
      deleteChatModal: new DeleteChatModal({
        header: 'Удаление чата',
        btnText: 'Удалить',
        btnClr: 'orange',
        itemSelectorHint: 'Выберите чат',
        btnClickHandler: async (id: string) => {
          await ChatController.deleteChat(id);
          await ChatController.getChats();
        }
      }),
      uploadImageMsgModal: new addFileModal({
        publicId: 'modal',
        actionLinkText: 'Выбрать файл на компьютере',
        btnText: 'Загрузить',
        fileInputName: 'resource',
        addFileModalHandler: async (formData) => {
          console.log('formData ', [...formData.entries()]);
          await ChatController.sendFile(formData);
          this.children.uploadImageMsgModal.reset();
          this.children.uploadImageMsgModal.hide();
        }
      }),
      userName: 'Название чата',
      userAvatar: './images/dummy.jpg',
      currentOpenedChat: null
    });

    void ChatController.getChats();
  }

  render() {
    return rawTemplate;
  }

  hideAllMenus() {
    this.children.chatUsersMenu.hide();
    this.children.appendFileMenu.hide();
    this.children.chatListMenu.hide();
  }

  componentDidMount() {
    this.children.addChatModal.hide();
    this.children.addUserModal.hide();
    this.children.deleteUserModal.hide();
    this.children.deleteChatModal.hide();
    this.children.uploadImageMsgModal.hide();

    this.children.appendFileMenu.hide();
    this.children.chatUsersMenu.hide();
    this.children.chatListMenu.hide();
  }
}

export default connect(Chat,
  (state) => ({
    currentOpenedChat: state.currentOpenedChat
  }),
  function (this: Chat, state: StoreState) {
    this.setProps({
      chatTitle: state.currentOpenedChat ? state.currentOpenedChat.title : '',
      currentOpenedChat: state.currentOpenedChat
    });
  }
);
