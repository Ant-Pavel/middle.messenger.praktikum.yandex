import Block from '../../utils/Block';
import './chatPlank.pcss';
import rawTemplate from './ChatPlank.hbs?raw';

export interface ChatPlankProps {
  id: number;
  avatar?: string;
  title: string;
  unread_count?: number;
  lastMsgTime?: string;
  lastMsgContent?: string;
  [key: string]: unknown;
}

export default class ChatPlank extends Block {
  constructor(props: ChatPlankProps) {
    super(props);
  }

  render() {
    return rawTemplate;
  }
}
