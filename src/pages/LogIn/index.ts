import './logIn.pcss';
import Button from '../../components/button';
import FormControl from '../../components/formControl';
import ActionLink from '../../components/actionLink';
import PagesNavigation from '../../components/pagesNavigation';
import Block from '../../utils/Block';
import rawTemplate from './LogIn.hbs?raw';
import formValidation from '../../utils/formValidation';

type LogInProps = {
  logInControls: ((ConstructorParameters<typeof FormControl>)[0])[],
  changePage: (pageId: string) => void,
  navigationList: ((ConstructorParameters<typeof PagesNavigation>)[0])['navigationList']
};

export default class Profile extends Block {
  constructor(props: LogInProps) {
    super({
      ...props,
      button: new Button({
        id: 'logInBtn',
        text: 'Авторизоваться',
        type: 'submit',
      }),
      formControls: props.logInControls.map(function (item) {
        return new FormControl({
          label: item.label,
          type: item.type,
          value: item.value,
          inputName: item.inputName,
          publicId: item.inputName,
        });
      }),
      events: {
        'formElement.submit': (event: Event) => {
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
          } else {
            console.log(`Form is not valid. Not valid fields - ${notValidFields.map(({ name }) => name).join(', ')}`);
            notValidFields.forEach(({ name, value }) => {
              const controlBlock = this.lists.formControls.find(fc => fc.publicId === name);
              controlBlock?.setProps({ hint: 'Невалидное значение', value });
            });
          }
        },
      },
      enterLink: new ActionLink(
        {
          id: 'signInEntranceLink',
          text: 'Нет аккаунта?',
          link: 'SignIn',
          events: {
            click: function (event: Event) {
              event.preventDefault();
              const link = (event.target as HTMLElement).dataset.link;
              if (link) {
                props.changePage(link);
              }
            },
          },
        },
      ),
      pagesNavigation: new PagesNavigation({ navigationList: props.navigationList, changePage: props.changePage }),
    });
  }

  render() {
    return rawTemplate;
  }
}