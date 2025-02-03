import './signUp.pcss';
import Button from '../../components/button';
import FormControl from '../../components/formControl';
import PagesNavigation from '../../components/pagesNavigation';
import Block from '../../utils/Block';
import rawTemplate from './SignUp.hbs?raw';
import formValidation from '../../utils/formValidation';
import SignUpController from './SignUpController';
import ActionLink from '@/components/actionLink';

type SignInProps = {
  signUpControls: ((ConstructorParameters<typeof FormControl>)[0])[],
  changePage: (pageId: string) => void,
  navigationList: ((ConstructorParameters<typeof PagesNavigation>)[0])['navigationList']
};

export default class Profile extends Block {
  constructor(props: SignInProps) {
    super({
      ...props,
      button: new Button({
        text: 'Зарегистрироваться',
        type: 'submit',
      }),
      formControls: props.signUpControls.map(function (item) {
        return new FormControl({
          label: item.label,
          type: item.type,
          value: item.value,
          inputName: item.inputName,
          publicId: item.inputName,
        });
      }),
      enterLink: new ActionLink(
        {
          id: 'signInEntranceLink',
          text: 'Войти',
          link: 'LogIn',
          events: {
            click: function (event: Event) {
              event.preventDefault();
              SignUpController.goToLogInPage();
            },
          },
        },
      ),
      events: {
        'formElement.submit': async (event: Event) => {
          event.preventDefault();

          const formData = Array.from((event.target as HTMLFormElement).elements)
            .filter(({ tagName }) => tagName === 'INPUT')
            .map(({ name, value }: HTMLInputElement) => ({ name, value }));

          const notValidFields = formData.filter(({ name, value }: { name: string, value: string }) => {
            if (!formValidation.hasOwnProperty(name)) throw new Error(`Form submit. Неизвестное поле валидации ${name}`);
            return !formValidation[name as keyof typeof formValidation](value);
          });
          if (!notValidFields.length) {
            console.log('Form is valid', formData);
            const signUpRes = await SignUpController.signUp(formData);
            if (!signUpRes) {
              this.setMsg('Что-то пошло не так. Попробуйте позже');
              return;
            }
            const { status, text } = signUpRes;
            if (status === 200) {
              this.cleanFields();
              this.setMsg(text);
            } else {
              this.setMsg(text);
            }
          } else {
            console.log(`Form is not valid. Not valid fields - ${notValidFields.map(({ name }) => name).join(', ')}`);
            notValidFields.forEach(({ name, value }) => {
              const controlBlock = this.lists.formControls.find(fc => fc.publicId === name);
              controlBlock?.setProps({ hint: 'Невалидное значение', value });
            });
          }
        },
      }
    });
  }

  cleanFields() {
    const wrapEl = this.getContent();
    const form = wrapEl.querySelector('form') as HTMLFormElement;
    Array.from(form.elements).forEach((el: HTMLElement) => {
      if (el.tagName === 'INPUT') {
        (el as HTMLInputElement).value = '';
      }
    });
  }

  setMsg(text: string) {
    const wrapEl = this.getContent();
    const messageEl = wrapEl.querySelector('.signUp__message') as HTMLElement;
    messageEl.textContent = text;
  }

  render() {
    return rawTemplate;
  }
}
