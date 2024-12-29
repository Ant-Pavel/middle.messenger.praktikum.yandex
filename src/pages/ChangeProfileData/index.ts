import './profile.pcss';
import SidebarArrowLink from '../../components/sidebarArrowLink';
import ProfileAvatar from '../../components/profileAvatar';
import Button from '../../components/button';
import FormControl from '../../components/formControl';
import PagesNavigation from '../../components/pagesNavigation';
import Block from '../../utils/Block';
import rawTemplate from './ChangeProfileData.hbs?raw';
import formValidation from '../../utils/formValidation';

type ChangeProfileProps = {
  changeProfileInfoControls: ((ConstructorParameters<typeof FormControl>)[0])[],
  changePage: (pageId: string) => void,
  navigationList: ((ConstructorParameters<typeof PagesNavigation>)[0])['navigationList']
};

export default class Profile extends Block {
  constructor(props: ChangeProfileProps) {
    super({
      ...props,
      sidebarArrowLink: new SidebarArrowLink({
        href: '#',
        events: {
          'click': function (event: Event) {
            event.preventDefault();
            props.changePage('Profile');
          },
        },
      }),
      profileAvatar: new ProfileAvatar({
        changeAvatarText: 'Сменить аватар',
      }),
      button: new Button({
        id: 'saveProfileChanges',
        text: 'Сохранить',
        type: 'submit',
      }),
      formControls: props.changeProfileInfoControls.map(function (item) {
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
      pagesNavigation: new PagesNavigation({ navigationList: props.navigationList, changePage: props.changePage }),
    });
  }

  render() {
    return rawTemplate;
  }
}