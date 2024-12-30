import './chatMsgForm.pcss';
import Block from '../../utils/Block';
import formValidation from '../../utils/formValidation';
import rawTemplate from './ChatMsgForm.hbs?raw';

type ChatMsgFormProps = {
  onAppendBtnClick: () => void
};

export default class ChatMsgForm extends Block {
  constructor(props: ChatMsgFormProps) {
    super({
      ...props,
      events: {
        'appendBtn.click': props.onAppendBtnClick,
        'submit': (event: Event) => {
          event.preventDefault();

          const formData = Array.from((event.target as HTMLFormElement).elements)
            .filter(({ tagName }) => tagName === 'TEXTAREA')
            .map(({ name, value }: HTMLInputElement) => ({ name, value }));

          const notValidFields = formData.filter(({ name, value }: { name: string, value: string }) => {
            if (!formValidation.hasOwnProperty(name)) throw new Error(`Form submit. Неизвестное поле валидации ${name}`);
            return !formValidation[name as keyof typeof formValidation](value);
          });
          if (!notValidFields.length) {
            console.log('Form is valid', formData);
          } else {
            console.log(`Form is not valid. Not valid fields - ${notValidFields.map(({ name }) => name).join(', ')}`);
          }
        },
      },
    });
  }

  render() {
    return rawTemplate;
  }
}
