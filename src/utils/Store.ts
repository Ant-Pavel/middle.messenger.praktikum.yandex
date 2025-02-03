import EventBus from './EventBus';
import { debounce } from './functions';
import { ChatMsgImageProps } from '@/components/chatMsgImage';
import { ChatMsgTextProps } from '@/components/chatMsgText';
import { ChatMsgDayLineProps } from '@/components/chatMsgDayLine';
import { ChatPlankProps } from '@/components/chatPlank';

export enum StoreEvents {
  Updated = 'updated'
}

export type Indexed<T = unknown> = {
  [key in string]: T;
};

export type UserInfoObj = {
  'id': number,
  'first_name': string,
  'second_name': string,
  'display_name': string | null,
  'phone': string,
  'login': string,
  'avatar': string | null,
  'email': string
};

export type StoreState = {
  profileControls:{
    label: string;
    type: string;
    value: string;
    inputName: string;
  }[],

  profileTableData: {
    name: string,
    value: string
  }[];

  profilePageMode: 'readData' | 'changeData' | 'changePassword';

  userInfo: UserInfoObj | null;

  searchUsersList: Array<{ id: number, login: string }>;

  chatList: Array<ChatPlankProps>;

  currentOpenedChat: {
    id: string;
    title: string;
    avatar: string | null;
    users: Array<{
      id: string;
      login: string;
    }>;
  } | null;

  // cop - текущий открытый чат
  cop_hasUnshownMessages: boolean;        // флаг для подгрузки сообщений из истории
  cop_unshownMessagesOffset: number;      // номер сообщения, с которого нужно подгружать сообщения из истории
  cop_gotFromServerMsgsAmount: number;    // количество полученных от сервера сообщений
  cop_newMsgAmount: number;               // количество непрочитанных сообщений
  cop_transformedMsgList: Array<ChatMsgImageProps | ChatMsgTextProps | ChatMsgDayLineProps> // трансформированные для отображения сообщения со вставками дней (1 января)
  cop_insertTransformedMsgInfo: { type: 'initial' | 'append' | 'prepend', count: number };  // Информация для в ставки в DOM  трансформированных сообщений
  cop_openedSocket: null | WebSocket;     // открытый сокет текущего чата 

  resourcesBasePath: string;
};

function merge(lhs: Indexed, rhs: Indexed): Indexed {
  if (Array.isArray(lhs) && Array.isArray(rhs)) {
    if (rhs.length < lhs.length) {
      lhs.length = rhs.length;
    }
  }
  Object.keys(rhs).forEach((key) => {
    if (lhs.hasOwnProperty(key) && (typeof (rhs[key]) === 'object' && rhs[key] !== null && Object.keys(rhs[key]).length) && (typeof (lhs[key]) === 'object' && lhs[key] !== null)) {
      merge(lhs[key] as Indexed, rhs[key] as Indexed);
    } else {
      lhs[key] = rhs[key];
    }
  });

  return lhs;
}


function set(object: Indexed, path: string, value: unknown): Indexed {
  if (!(typeof object === 'object' && ((object as object).constructor === Object))) {
    return object;
  }

  if (typeof (path) !== 'string') {
    throw new Error('path must be string');
  }

  const rhs = path.split('.').reduceRight<Indexed>((acc, field) => {
    return {
      [field]: acc
    };
  }, value as Indexed);

  return merge(object, rhs);
}

class Store extends EventBus {
  private _emitStoreUpdateDebounced: () => void;

  constructor() {
    super();
    this._emitStoreUpdateDebounced = debounce(() => this.emit(StoreEvents.Updated));
  }

  private state: StoreState = {
    resourcesBasePath: 'https://ya-praktikum.tech/api/v2/resources/',
    profileControls: [
      {
        label: 'Почта',
        type: 'email',
        value: '',
        inputName: 'email',
      },
      {
        label: 'Логин',
        type: 'text',
        value: '',
        inputName: 'login',
      },
      {
        label: 'Имя',
        type: 'text',
        value: '',
        inputName: 'first_name',
      },
      {
        label: 'Фамилия',
        type: 'text',
        value: '',
        inputName: 'second_name',
      },
      {
        label: 'Имя в чате',
        type: 'text',
        value: '',
        inputName: 'display_name',
      },
      {
        label: 'Телефон',
        type: 'tel',
        value: '',
        inputName: 'phone',
      },
    ],
    userInfo: null,
    profileTableData: [],
    profilePageMode: 'readData',

    
    // chats
    searchUsersList: [],
    chatList: [],
    currentOpenedChat: null,
    cop_insertTransformedMsgInfo: { type: 'initial', count: 0 },
    cop_openedSocket: null,
    cop_hasUnshownMessages: false, 
    cop_unshownMessagesOffset: 0, 
    cop_gotFromServerMsgsAmount: 0, 
    cop_newMsgAmount: 0, 
    cop_transformedMsgList: []
  };

  public getState() {
    return this.state;
  }

  public set(path: string, value: unknown) {
    // console.log('store set ', path, value);
    set(this.state, path, value);

    this._emitStoreUpdateDebounced();
  }

}

export default new Store;

