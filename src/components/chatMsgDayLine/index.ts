import Block from '../../utils/Block';
import './chatMsgDayLine.pcss';
import rawTemplate from './ChatMsgDayLine.hbs?raw';

export type ChatMsgDayLineProps = {
  type: 'dayLine';
  content: string;
  [key: string]: unknown;
};

export default class ChatMsgDayLine extends Block {
  constructor(props: ChatMsgDayLineProps) {
    super(props);
  }

  render() {
    return rawTemplate;
  }
}
