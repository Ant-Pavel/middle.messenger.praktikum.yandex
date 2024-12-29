import Block from '../../utils/Block';
import './chatMsgText.pcss';
import rawTemplate from './ChatMsgText.hbs?raw';

export type ChatMsgTextProps = {
  type: 'text';
  content: string;
  time: string;
  status: string;
  isMine: boolean;
};

export default class ChatMsgText extends Block {
  constructor(props: ChatMsgTextProps) {
    super(props);
  }

  render() {
    return rawTemplate;
  }
}
