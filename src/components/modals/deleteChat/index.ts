import Block from '@/utils/Block';
import type { Props } from '@/utils/Block';
import '../common.pcss';
import './deleteChatModal.pcss';
import rawTemplate from './DeleteChatModal.hbs?raw';
import Button from '@/components/button';
import ItemSelector from '@/components/itemSelector';
import store, { StoreState } from '@/utils/Store';
import connect from '@/utils/connectStoreToComponent';

interface ModalProps extends Props {
  btnText: string;
  header: string;
  itemSelectorHint?: string;
  btnClickHandler: (id: string) => void
}

let chosenItemId: null | string = null;

class DeletChatModal extends Block {
  constructor(props: ModalProps) {
    super({
      ...props,
      button: new Button({
        text: 'Удалить',
        type: 'button',
        disabled: true,
        events: {
          click: () => {
            console.log('btn click ', chosenItemId);
            if (chosenItemId) {
              props.btnClickHandler(chosenItemId);
              this.reset();
              this.hide();
            }
          }
        }
      }),
      itemSelector: new ItemSelector({
        items: store.getState().chatList.map(({ id, title }) => ({ id, name: title })),
        hint: props.itemSelectorHint,
        events: {
          'click': (event: Event) => {
            if (!(event.target as HTMLElement).dataset.userid) return;
            this.handleUserSelection((event.target as HTMLElement).dataset.userid as string);
          }
        }
      }),
      events: {
        'overlay.click': (event: Event) => {
          if (event.target !== event.currentTarget) return;
          this.reset();
          this.hide();
        }
      }
    });
    console.log('props.items', props.items);
  }

  reset() {
    chosenItemId = null;
    this.children.itemSelector.setProps({
      items: []
    });
  }

  render() {
    return rawTemplate;
  }

  handleUserSelection(chatId: string) {
    chosenItemId = chatId;
    this.children.button.setProps({
      disabled: false
    });
    this.children.itemSelector.setProps({
      items: store.getState().chatList.map(item => ({ id: item.id, name: item.title, chosen: String(item.id) === chatId }))
    });
  }
}

export default connect(DeletChatModal,
  (state) => {
    return { chatList: state.chatList };
  },
  function (this: DeletChatModal, state: StoreState) {
    this.children.itemSelector.setProps({
      items: state.chatList.map(({ id, title }) => ({ id, name: title }))
    });
  }
);
