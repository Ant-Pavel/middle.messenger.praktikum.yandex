import Block from '../../utils/Block';
// import './chatMsgImage.pcss';
import rawTemplate from './ChatMsgImage.hbs?raw';

export type ChatMsgImageProps = {
  type: 'file';
  user_id: number;
  src: string;
  chatTimeStr: string;
  isMine: boolean;
  userLogin: string;
  showUserName: boolean;
  time: Date;
  [key: string]: unknown;
};

export default class ChatMsgText extends Block {
  constructor(props: ChatMsgImageProps) {
    super(props);
  }

  render() {
    return rawTemplate;
  }
}
