import Block from '@/utils/Block';
import type { Props } from '@/utils/Block';
import '../common.pcss';
import './addChatModal.pcss';
import rawTemplate from './AddChatModal.hbs?raw';
import Button from '@/components/button';
import FormControl from '@/components/formControl';

interface ModalProps extends Props {
  btnText: string;
  btnClickHandler: (id: string) => void
}

export default class Modal extends Block {
  constructor(props: ModalProps) {
    super({
      ...props,
      button: new Button({
        text: props.btnText,
        type: 'submit'
      }),
      addChatControl: new FormControl({
        label: 'Логин',
        type: 'text',
        value: '',
        inputName: 'addChatName',
        checkValidation: false
      }),
      events: {
        ...props.events,
        'modalForm.submit': (event: Event) => {
          event.preventDefault();

          const formData = Array.from((event.target as HTMLFormElement).elements)
            .filter(({ tagName }) => tagName === 'INPUT')
            .map(({ name, value }: HTMLInputElement) => ({ name, value }));

          const inputValue = formData[0].value;

          if (!inputValue) {
            this.setProps({
              hint: 'Введите название чата'
            });
            return;
          }

          props.btnClickHandler(inputValue);
          this.reset();
          this.hide();
        },
        'overlay.click': (event: Event) => {
          if (event.target !== event.currentTarget) return;
          this.reset();
          this.hide();
        }
      }
    });
  }

  reset() {
    this.children.addChatControl.setProps({
      value: '',
    });

    this.setProps({
      hint: ''
    });
  }

  render() {
    return rawTemplate;
  }
}
