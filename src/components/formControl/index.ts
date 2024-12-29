import Block from '../../utils/Block';
import './formControl.pcss';
import rawTemplate from './FormControl.hbs?raw';
import formValidation from '../../utils/formValidation';

type FormControlProps = {
  label: string;
  type: string;
  value: string;
  inputName: string;
  hint?: string;
  publicId?: string
};


export default class FormControl extends Block {
  constructor(props: FormControlProps) {
    super({
      ...props,
      events: {
        'input.focus': () => {
          this.getContent().classList.add('formControl--focused');
        },
        'input.blur': (event: Event) => {
          this.getContent().classList.remove('formControl--focused');
          const { name, value } = event.target as HTMLInputElement;
          if (!formValidation.hasOwnProperty(name)) throw new Error(`Form submit. Неизвестное поле валидации ${name}`);
          const isFieldValid = formValidation[name as keyof typeof formValidation](value);
          if (isFieldValid) {
            this.setProps({ hint: '', value });
          } else {
            this.setProps({ hint: 'Невалидное значение', value });
          }

          if (value) {
            this.getContent().classList.add('formControl--hasValue');
          } else {
            this.getContent().classList.remove('formControl--hasValue'); 
          }
        },
      },
    });
  }

  render() {
    return rawTemplate;
  }
}
