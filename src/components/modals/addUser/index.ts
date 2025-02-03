import Block from '@/utils/Block';
import type { Props } from '@/utils/Block';
import '../common.pcss';
import './addUser.pcss';
import rawTemplate from './addUserModal.hbs?raw';
import Button from '@/components/button';
import ItemSelector from '@/components/itemSelector';
import FormControl from '@/components/formControl';
import connect from '@/utils/connectStoreToComponent';
import AddUserController from './AddUserController';
import store, { StoreState } from '@/utils/Store';

interface ModalProps extends Props {
  btnText: string;
  btnClickHandler: (id: string) => void
}

let chosenUserId: null | string = null;

class AddUserModal extends Block {
  constructor(props: ModalProps) {
    super({
      ...props,
      button: new Button({
        text: 'Добавить',
        type: 'button',
        disabled: true,
        events: {
          click: () => {
            if (chosenUserId) {
              props.btnClickHandler(chosenUserId);
              this.reset();
              this.hide();
            }
          }
        }
      }),
      addUserControl: new FormControl({
        label: 'Логин пользователя',
        type: 'text',
        value: '',
        inputName: 'addUserLogin',
        checkValidation: false,
        events: {
          input: async (event: Event) => {
            const { value } = event.target as HTMLInputElement;
            await AddUserController.searchUsers(value);

            chosenUserId = null;
            this.children.button.setProps({
              disabled: true
            });
            this.children.itemSelector.setProps({
              items: store.getState().searchUsersList.map(item => ({ id: item.id, name: item.login, chosen: false }))
            });
          }
        }
      }),
      itemSelector: new ItemSelector({
        items: [],
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
  }

  reset() {
    chosenUserId = null;
    AddUserController.resetUsersList();
    this.children.addUserControl.setProps({
      value: ''
    });
  }

  render() {
    return rawTemplate;
  }

  handleUserSelection(userId: string) {
    chosenUserId = userId;
    this.children.button.setProps({
      disabled: false
    });
    this.children.itemSelector.setProps({
      items: store.getState().searchUsersList.map(item => ({ id: item.id, name: item.login, chosen: String(item.id) === userId }))
    });
  }
}

export default connect(AddUserModal,
  (state) => {
    return { searchUsersList: state.searchUsersList };
  },
  function (this: AddUserModal, state: StoreState) {
    this.children.itemSelector.setProps({
      items: state.searchUsersList.map(({ id, login }) => ({ id, name: login }))
    });

    this.children.button.setProps({
      disabled: true
    });
  }
);
