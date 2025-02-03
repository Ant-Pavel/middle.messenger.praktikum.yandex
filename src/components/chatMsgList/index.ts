import Block, { Props } from '../../utils/Block';
import ChatMsgText from '../chatMsgText';
import ChatMsgImage from '../chatMsgImage';
import ChatMsgDayLine from '../chatMsgDayLine';
import rawTemplate from './ChatMsgList.hbs?raw';
import connect from '@/utils/connectStoreToComponent';
import { StoreState } from '@/utils/Store';
import { debounce } from '@/utils/functions';
import ChatController from '@/pages/Chat/ChatController';


const scrollHandler = (event: Event) => {
  if ((event.target as HTMLElement).scrollTop < 100) {
    ChatController.getPreviousMessages();
  }
};
const scrollHandlerDebouced = debounce(scrollHandler, 100);

class ChatMsgList extends Block {
  constructor(props: Props) {
    super({
      ...props,
      messages: []
    });
  }

  addScrollListener() {
    this.getContent().addEventListener('scroll', scrollHandlerDebouced);
  }

  removeScrollListener() {
    this.getContent().removeEventListener('scroll', scrollHandlerDebouced);
  }


  render() {
    return rawTemplate;
  }
}


export default connect(
  ChatMsgList,
  (state) => ({
    cop_transformedMsgList: state.cop_transformedMsgList,
    cop_insertTransformedMsgInfo: state.cop_insertTransformedMsgInfo,
    cop_unshownMessagesOffset: state.cop_unshownMessagesOffset
  }),
  function (this: ChatMsgList, state: StoreState) {
    this.removeScrollListener();
    const { type, count } = state.cop_insertTransformedMsgInfo;
    if (state.cop_unshownMessagesOffset <= 20) {
      this.setLists({
        messages: state.cop_transformedMsgList.map((msg) => {
          if (msg.type === 'file') return new ChatMsgImage(msg);
          if (msg.type === 'dayLine') return new ChatMsgDayLine(msg);
          return new ChatMsgText(msg);
        })
      });
      
      const messagesWrapEl = this.getContent();
      messagesWrapEl.scrollTop = 1e9;
    } else if (type === 'append') {
      const messagesWrapEl = this.getContent();
      const messagesToAppend = state.cop_transformedMsgList.slice(-count);
      messagesToAppend.forEach((msg) => {
        let component;
        if (msg.type === 'message') component = new ChatMsgText(msg);
        if (msg.type === 'file') component = new ChatMsgImage(msg);
        if (msg.type === 'dayLine') component = new ChatMsgDayLine(msg);
        messagesWrapEl.append((component as Block).getContent());
      });
      messagesWrapEl.scrollTop = 1e9;
    } else if (type === 'prepend') {
      const messagesWrapEl = this.getContent();
      const messagesToPrepend = state.cop_transformedMsgList.slice(0, count).reverse();
      messagesToPrepend.forEach((msg) => {
        let component;
        if (msg.type === 'message') component = new ChatMsgText(msg);
        if (msg.type === 'file') component = new ChatMsgImage(msg);
        if (msg.type === 'dayLine') component = new ChatMsgDayLine(msg);
        messagesWrapEl.prepend((component as Block).getContent());
      });
      messagesWrapEl.scrollTop = 100;
    }

    this.addScrollListener();
  }
);
