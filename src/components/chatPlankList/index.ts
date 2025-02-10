import Block, { Props } from '../../utils/Block';
import rawTemplate from './ChatPlankList.hbs?raw';
import connect from '@/utils/connectStoreToComponent';
import { StoreState } from '@/utils/Store';
import ChatPlank from '@/components/chatPlank';
import ChatController from '@/pages/Chat/ChatController';


let currentOpenedChatId: string | null = null;
class ChatPlankList extends Block {
  constructor(props: Props) {
    super({
      ...props,
      chatList: [],
    });
  }

  render() {
    return rawTemplate;
  }
}

function updateChatListActiveEl(listEl: HTMLElement) {
  listEl.querySelectorAll('.chatCard').forEach((el: HTMLElement) => {
    el.classList.remove('chatCard--active');
    if (el.dataset.dataid === currentOpenedChatId) {
      el.classList.add('chatCard--active');
      el.querySelector('.chatCard__unreadAmount')?.classList.add('d-none');
    }
  });
}

export default connect(
  ChatPlankList,
  (state) => ({
    chatList: state.chatList,
    currentOpenedChatNewMsgAmount: state.currentOpenedChatNewMsgAmount
  }),
  function (this: ChatPlankList, state: StoreState) {
    this.setLists({
      chatList: state.chatList.map((a) => {
        return new ChatPlank({
          ...a,
          events: {
            click: async (event: Event) => {
              // отметить выбранный
              const { dataid } = (event.currentTarget as HTMLElement).dataset;
              if (!dataid) return;
              if (dataid === currentOpenedChatId) return;
              currentOpenedChatId = dataid;
              const listEl = this.getContent();
              updateChatListActiveEl(listEl);

              // загрузить и отобразить сообщения
              try {
                await ChatController.setCurrentOpenedChat(dataid);
              } catch (error: unknown) {
                console.error('ChatPlankList::Error on setCurrentOpenedChat', error);
              }
              try {
                await ChatController.connectToChat(dataid);
              } catch (error: unknown) {
                console.error('ChatPlankList::Error on connectToChat', error);
              }
            }
          }
        });
      }),
    });

    if (currentOpenedChatId) {
      const listEl = this.getContent();
      updateChatListActiveEl(listEl);
    }
  }
);
