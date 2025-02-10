import Block from '../../utils/Block';
import './chatMsgText.pcss';
import rawTemplate from './ChatMsgText.hbs?raw';

export type ChatMsgTextProps = {
  type: 'message';
  user_id: number;
  content: string;
  chatTimeStr: string;
  isMine: boolean;
  userLogin: string;
  showUserName: boolean;
  time: Date;
  [key: string]: unknown;
};

export default class ChatMsgText extends Block {
  constructor(props: ChatMsgTextProps) {
    super(props);
  }

  render() {
    return rawTemplate;
  }
}
