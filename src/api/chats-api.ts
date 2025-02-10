import HTTP from '@/utils/HTTPTransport';

const chatsApiHTTP = new HTTP('/chats');

type ChatUser = {
  'id': number,
  'first_name': string,
  'second_name': string,
  'display_name': string,
  'login': string,
  'avatar': string | null,
  'role': 'admin' | 'user'
};

type Chat = {
  'id': number;
  'title': string;
  'avatar': string | null;
  'unread_count':  number;
  'created_by': number;
  'last_message': {
    'user': {
      'first_name': string;
      'second_name': string;
      'avatar': string | null;
      'email': string;
      'login': string;
      'phone': string;
    },
    'time': string;
    'content': string;
  }
};

type DeleteChatResponse = {
  'userId': number;
  'result': {
    'id': number;
    'title': string;
    'avatar': string;
    'created_by': number;
  }
};


class ChatsApi {
  async createChat(title: string) {
    const res = await chatsApiHTTP.post('/', {
      data: JSON.stringify({ title }),
      headers: {
        'content-type': 'application/json'
      }
    });

    return JSON.parse(res.response as string) as { 'id': number };
  }

  async deleteChat(id: string) {
    const res = await chatsApiHTTP.delete('/', {
      data: JSON.stringify({ chatId: id }),
      headers: {
        'content-type': 'application/json'
      }
    });

    return res.response as DeleteChatResponse;
  }

  async getChats() {
    const res = await chatsApiHTTP.get('/');

    return JSON.parse(res.response as string) as Chat[];
  }

  async getChatToken(chatId: string) {
    const res = await chatsApiHTTP.post(`/token/${chatId}`);

    return JSON.parse(res.response as string) as { token: string };
  }

  async getChatUsers(chatId: string) {
    const res = await chatsApiHTTP.get(`/${chatId}/users`);

    return JSON.parse(res.response as string) as ChatUser[];
  }

  async addUsersToChat(chatId: string, users: string[]) {
    const res = await chatsApiHTTP.put('/users', {
      data: JSON.stringify({ users, chatId }),
      headers: {
        'content-type': 'application/json'
      }
    });
    return res.response as string;
  }

  async deleteUsersFromChat(chatId: string, users: string[]) {
    const res = await chatsApiHTTP.delete('/users', {
      data: JSON.stringify({ users, chatId }),
      headers: {
        'content-type': 'application/json'
      }
    });
    return res.response as string;
  }

  async getNewMessagesCount(chatId: string) {
    const res = await chatsApiHTTP.get(`/new/${chatId}`);
    return JSON.parse(res.response as string) as { 'unread_count': number };
  }
}

export default new ChatsApi;
