import './chatMsgForm.pcss';
import Block from '../../utils/Block';
import formValidation from '../../utils/formValidation';
import rawTemplate from './ChatMsgForm.hbs?raw';

type ChatMsgFormProps = {
  onAppendBtnClick: (event: Event) => void,
  sendMsgHandler: (msg: string) => void
};

export default class ChatMsgForm extends Block {
  constructor(props: ChatMsgFormProps) {
    const sendHandler = () => {
      const formEl = this.getContent();
      const formData = Array.from((formEl as HTMLFormElement).elements)
        .filter(({ tagName }) => tagName === 'TEXTAREA')
        .map(({ name, value }: HTMLInputElement) => ({ name, value }));

      const notValidFields = formData.filter(({ name, value }: { name: string, value: string }) => {
        if (!formValidation.hasOwnProperty(name)) throw new Error(`Form submit. Неизвестное поле валидации ${name}`);
        return !formValidation[name as keyof typeof formValidation](value);
      });
      if (!notValidFields.length) {
        console.log('Form is valid', formData);
        const msg = formData[0].value;
        props.sendMsgHandler(msg);
        (this.getContent().querySelector('.msgForm__textarea') as HTMLTextAreaElement).value = '';
      } else {
        console.log(`Form is not valid. Not valid fields - ${notValidFields.map(({ name }) => name).join(', ')}`);
      }
    };

    super({
      ...props,
      events: {
        'appendBtn.click': props.onAppendBtnClick,
        'submit': (event: Event) => {
          event.preventDefault();
          sendHandler();
        },
        'keydown': (event: KeyboardEvent) => {
          if (!event.shiftKey && event.code === 'Enter' && event.key === 'Enter') {
            event.preventDefault();
            sendHandler();
          }
        }
      },
    });
  }

  render() {
    return rawTemplate;
  }
}
