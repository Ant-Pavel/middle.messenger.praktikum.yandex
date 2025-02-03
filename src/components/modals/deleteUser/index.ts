import Block from '@/utils/Block';
import type { Props } from '@/utils/Block';
import '../common.pcss';
import './deleteUserModal.pcss';
import rawTemplate from './deleteUserModal.hbs?raw';
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
        items: store.getState().currentOpenedChat ? store.getState().currentOpenedChat.users.map(({ id, login }) => ({ id, name: login })) : [],
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
    // this.children.itemSelector.setProps({
    //   items: []
    // });
  }

  render() {
    return rawTemplate;
  }

  handleUserSelection(userId: string) {
    chosenItemId = userId;
    this.children.button.setProps({
      disabled: false
    });
    this.children.itemSelector.setProps({
      items: store.getState().currentOpenedChat.users.map(({ id, login }) => ({ id, name: login, chosen: String(id) === userId }))
    });
  }
}

export default connect(DeletChatModal,
  (state) => {
    return { chatList: state.currentOpenedChat };
  },
  function (this: DeletChatModal, state: StoreState) {
    this.children.itemSelector.setProps({
      items: state.currentOpenedChat ? state.currentOpenedChat.users.map(({ id, login }) => ({ id, name: login })) : []
    });
  }
);
