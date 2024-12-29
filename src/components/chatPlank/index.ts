import Block from '../../utils/Block';
import './chatPlank.pcss';
import rawTemplate from './ChatPlank.hbs?raw';

export interface ChatPlankProps {
  id: string;
  isActive: boolean;
  avatarImgUrl?: string;
  name: string;
  time?: string;
  unreadAmount?: string;
  chatItemClick: (event: Event) => void
}

export default class ChatPlank extends Block {
  constructor(props: ChatPlankProps) {
    super({
      ...props,
      events: {
        'click': props.chatItemClick,
      },
    });
  }

  render() {
    return rawTemplate;
  }
}