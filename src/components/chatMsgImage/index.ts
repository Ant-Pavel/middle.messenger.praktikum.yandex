import Block from '../../utils/Block';
import './chatMsgImage.pcss';
import rawTemplate from './chatMsgImage.hbs?raw';

export type ChatMsgImageProps = {
  type: 'image';
  src: string;
  time: string;
  status: string;
  isMine: boolean;
};

export default class ChatMsgText extends Block {
  constructor(props: ChatMsgImageProps) {
    super(props);
  }

  render() {
    return rawTemplate;
  }
}
