import Block from '../../utils/Block';
import ChatMsgText, { type ChatMsgTextProps } from '../chatMsgText';
import ChatMsgImage, { type ChatMsgImageProps } from '../chatMsgImage';
import './chatMsgGroup.pcss';
import rawTemplate from './ChatMsgGroup.hbs?raw';

type ChatMsgGroupProps = {
  date: string;
  messages: (ChatMsgTextProps | ChatMsgImageProps)[]
};

export default class ChatMsgGroup extends Block {
  constructor(props: ChatMsgGroupProps) {
    super({
      ...props,
      messages: props.messages.map((msg) => {
        if (msg.type === 'text') return new ChatMsgText(msg);
        if (msg.type === 'image') return new ChatMsgImage(msg);
      }),
    });
  }

  render() {
    return rawTemplate;
  }
}
