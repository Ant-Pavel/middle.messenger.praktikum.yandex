
import store, { StoreState } from '@/utils/Store';
import chatsApi from '@/api/chats-api';
import resourcesApi from '@/api/resources-api';
import { cloneDeep, isPlainObject, getRussianDate, getChatTimeStr } from '@/utils/functions';
import { ChatMsgImageProps } from '@/components/chatMsgImage';
import { ChatMsgTextProps } from '@/components/chatMsgText';

type SocketTextMessage = {
  id: number;
  user_id: number;
  type: 'message';
  chat_id: number;
  time: string;
  content: string;
};

type SocketFileMessage = {
  id: number;
  user_id: number;
  type: 'file';
  chat_id: number;
  time: string;
  content: string;
  file: {
    id: number;
    user_id: number;
    path: string;
    filename: string;
    content_type: string;
    content_size: number;
    upload_date: string;
  }
};

class ProfileContoller {
  async createChat(title: string) {
    await chatsApi.createChat(title);
  }

  async deleteChat(id: string) {
    await chatsApi.deleteChat(id);
  }

  async setCurrentOpenedChat(id: string) {
    console.log('id ', id);
    const getChatUserRes = await chatsApi.getChatUsers(id);
    const getNewMessagesCountRes = await chatsApi.getNewMessagesCount(id);
    const chatList = store.getState().chatList;
    console.log('chatList ', chatList);
    const chatInfo = chatList.find((chat) => chat.id === Number(id)) as (typeof chatList)[number];
    store.set('currentOpenedChat', {
      id,
      title: chatInfo.title,
      users: getChatUserRes,
    });

    store.set('cop_hasUnshownMessages', true);
    store.set('cop_unshownMessagesOffset', 0);
    store.set('cop_gotFromServerMsgsAmount', 0);
    store.set('cop_newMsgAmount', getNewMessagesCountRes.unread_count);
  }

  async connectToChat(chatId: string) {
    store.set('cop_transformedMsgList', []);
    store.set('cop_insertTransformedMsgInfo', { type: 'initial', count: 0 });
    const openedSocket = store.getState().cop_openedSocket;
    if (openedSocket) {
      openedSocket.close();
    }
    const userInfo = store.getState().userInfo;
    if (!userInfo) return;
    const userId = userInfo.id;
    const getChatTokenResponse = await chatsApi.getChatToken(chatId);
    const { token } = getChatTokenResponse;

    const chatUsers = await chatsApi.getChatUsers(chatId);

    // Получение пользователей для определения автора сообщения
    const chatUsersDict = chatUsers.reduce((acc, { id, login }) => {
      acc[id] = login;
      return acc;
    }, {} as Record<string, string>);

    const resourcesBasePath = store.getState().resourcesBasePath;

    const currentUserId = store.getState().userInfo?.id;
    const socket = new WebSocket(`wss://ya-praktikum.tech/ws/chats/${userId}/${chatId}/${token}`);
    let pingInterval: number;

    socket.addEventListener('open', () => {
      console.log('соединение установлено');

      store.set('cop_openedSocket', socket);

      socket.send(JSON.stringify({
        type: 'get old',
        content: '0'
      }));

      pingInterval = setInterval(() => {
        socket.send(JSON.stringify({ type: 'ping' }));
      }, 3000);
    });
  
    socket.addEventListener('message', (event) => {
      const messageData = JSON.parse(event.data as string) as (SocketTextMessage | SocketFileMessage | (SocketTextMessage | SocketFileMessage)[]);
      // console.log(`Получены данные ${chatId} `, messageData);

      // Проверка по типу содержмиого
      if (Array.isArray(messageData) && messageData.length) { // Получение списка сообщений
        console.log('Получение списка сообщений');
        store.set('cop_gotFromServerMsgsAmount', store.getState().cop_gotFromServerMsgsAmount + messageData.length);
        store.set('cop_newMsgAmount', store.getState().cop_newMsgAmount - messageData.length);


        if (messageData.length === 20) {
          store.set('cop_hasUnshownMessages', true);
          store.set('cop_unshownMessagesOffset', store.getState().cop_unshownMessagesOffset + 20);
        } else {
          store.set('cop_hasUnshownMessages', false);
        }

        // Сначала самые поздние идут, нужно изменить порядок
        const msgListReversed = messageData.reverse();
        let lastMsgAuthor = messageData[0].user_id;
        let currentDayStr = getRussianDate(new Date(messageData[0].time));

        const msgListTransformed: StoreState['cop_transformedMsgList'] = [];

        // Начальная дата перед первым сообщением в чате
        if (!store.getState().cop_hasUnshownMessages) {
          msgListTransformed.push({ type: 'dayLine', content: currentDayStr });
        }

        msgListReversed.forEach((msg, index) => {
          const msgDateParsed = new Date(msg.time);
          const msgDayText = getRussianDate(msgDateParsed);

          if (msgDayText !== currentDayStr) {
            msgListTransformed.push({ type: 'dayLine', content: msgDayText, time: msgDateParsed });
            currentDayStr = msgDayText;
          }

          if (msg.type === 'message') {
            msgListTransformed.push({
              id: msg.id,
              user_id: msg.user_id,
              type: 'message',
              content: msg.content,
              time: msgDateParsed,
              chatTimeStr: getChatTimeStr(msgDateParsed),
              userLogin: chatUsersDict[msg.user_id],
              isMine: currentUserId === msg.user_id,
              showUserName: lastMsgAuthor !== null && currentUserId !== msg.user_id && msg.user_id !== lastMsgAuthor
            });
          } else if (msg.type === 'file') {
            msgListTransformed.push({
              id: msg.id,
              user_id: msg.user_id,
              type: 'file',
              src: `${resourcesBasePath}${msg.file.path}`,
              chatTimeStr: getChatTimeStr(msgDateParsed),
              time: msgDateParsed,
              userLogin: chatUsersDict[msg.user_id],
              isMine: currentUserId === msg.user_id,
              showUserName: lastMsgAuthor !== null && currentUserId !== msg.user_id && msg.user_id !== lastMsgAuthor
            });
          }

          if (msg.user_id !== lastMsgAuthor || index === messageData.length - 1) {
            lastMsgAuthor = msg.user_id;
          }
        });

        const openedChatMsgList = cloneDeep(store.getState().cop_transformedMsgList) as StoreState['cop_transformedMsgList'];
        store.set('cop_transformedMsgList', [...msgListTransformed, ...openedChatMsgList]);
        store.set('cop_insertTransformedMsgInfo', { type: 'prepend', count: msgListTransformed.length });
      }

      if (isPlainObject(messageData) && !Array.isArray(messageData) && ['file', 'message'].includes(messageData.type)) {
        store.set('cop_gotFromServerMsgsAmount', store.getState().cop_gotFromServerMsgsAmount + 1);
        const msgDateParsed = new Date(messageData.time);
        const msgList = store.getState().cop_transformedMsgList;

        const showDayLine = !msgList.length || (msgList.length && (msgList[msgList.length - 1] as (ChatMsgImageProps | ChatMsgTextProps)).time.getDate() < msgDateParsed.getDate());
        const lastMsgAuthor: number = msgList.length ? (msgList[msgList.length - 1] as (ChatMsgImageProps | ChatMsgTextProps)).user_id : 0;
        console.log('lastMsgAuthor ', lastMsgAuthor);

        if (showDayLine) {
          msgList.push({ type: 'dayLine', content: getRussianDate(msgDateParsed), time: msgDateParsed });
        }
        if (messageData.type === 'message') {
          msgList.push({
            id: messageData.id,
            type: 'message',
            user_id: messageData.user_id,
            content: messageData.content,
            time: msgDateParsed,
            chatTimeStr: getChatTimeStr(msgDateParsed),
            userLogin: chatUsersDict[messageData.user_id],
            isMine: currentUserId === messageData.user_id,
            showUserName: currentUserId !== messageData.user_id && messageData.user_id !== lastMsgAuthor
          });
        } else if (messageData.type === 'file') {
          msgList.push({
            id: messageData.id,
            type: 'file',
            user_id: messageData.user_id,
            src: `${resourcesBasePath}${messageData.file.path}`,
            chatTimeStr: getChatTimeStr(msgDateParsed),
            time: msgDateParsed,
            userLogin: chatUsersDict[messageData.user_id],
            isMine: currentUserId === messageData.user_id,
            showUserName: currentUserId !== messageData.user_id && messageData.user_id !== lastMsgAuthor
          });
        }


        store.set('cop_transformedMsgList', msgList);
        store.set('cop_unshownMessagesOffset', store.getState().cop_unshownMessagesOffset + 1);
        store.set('cop_insertTransformedMsgInfo', { type: 'append', count: showDayLine ? 2 : 1 });
      }
    });

    socket.addEventListener('close', (event) => {
      store.set('cop_openedSocket', null);
      clearInterval(pingInterval);
      if (event.wasClean) {
        console.log('clean close');
      } else {
        console.log('dirty close');
      }
      console.log(`Код: ${event.code} | Причина: ${event.reason}`);
    });


    socket.addEventListener('error', (event: ErrorEvent) => {
      store.set('cop_openedSocket', null);
      clearInterval(pingInterval);
      console.warn('Ошибка сокета', event.message);
    });
  }

  getPreviousMessages() {
    const openedChatId = store.getState().currentOpenedChat?.id;
    if (!openedChatId) return;

    const socket = store.getState().cop_openedSocket as WebSocket;
    const hasUnshownMessages = store.getState().cop_hasUnshownMessages;
    if (hasUnshownMessages) {
      const unshownMessagesOffset = store.getState().cop_unshownMessagesOffset;
      socket.send(JSON.stringify({
        type: 'get old',
        content: String(unshownMessagesOffset)
      }));
    }
  }

  async updateCurrentChatUsers() {
    const currentChat = store.getState().currentOpenedChat;
    if (!currentChat) return;
    const id = currentChat.id;
    const getChatUserRes = await chatsApi.getChatUsers(id);
    store.set('currentOpenedChat', { id, users: getChatUserRes as Array<{ id: number; login: string; }> });
  }

  async addUserToChat(id: string) {
    const chatId = store.getState().currentOpenedChat?.id as string;
    const addUserToChatRes = await chatsApi.addUsersToChat(chatId, [id]);
    console.log('addUserToChatRes ', addUserToChatRes);
  }

  async deleteUserFromChat(id: string) {
    const chatId = store.getState().currentOpenedChat?.id as string;
    const deleteUsersFromChatRes = await chatsApi.deleteUsersFromChat(chatId, [id]);
    console.log('deleteUsersFromChat ', deleteUsersFromChatRes);
  }

  async getChats() {
    const getChatsRes = await chatsApi.getChats();

    if (getChatsRes) {
      const chatList = getChatsRes.map(({ id, title, last_message, unread_count, avatar }) => {
        let lastMsgContent = '';
        let lastMsgTime = '';
        if (last_message) {
          lastMsgContent = last_message.content;
          lastMsgTime = last_message.time;
          lastMsgTime = getChatTimeStr(new Date(lastMsgTime));
        }
        return {
          id, title, unread_count, lastMsgContent,
          avatar: avatar || '',
          lastMsgTime: lastMsgTime
        };
      });
      store.set('chatList', chatList);
    }
  }

  sendMessage(msg: string) {
    const openedSocket = store.getState().cop_openedSocket;
    if (!openedSocket) return;
    openedSocket.send(JSON.stringify({
      content: msg,
      type: 'message'
    }));
  }

  async sendFile(data: FormData) {
    const openedSocket = store.getState().cop_openedSocket;
    if (!openedSocket) return;
    const sendFileRes = await resourcesApi.sendFile(data);
    console.log('sendFileRes ', sendFileRes);
    openedSocket.send(JSON.stringify({
      content: sendFileRes.id,
      type: 'file'
    }));
  }
}

export default new ProfileContoller;
