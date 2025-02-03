import './profile.pcss';
import Button from '../../components/button';
import FormControl from '../../components/formControl';
import Block from '../../utils/Block';
import rawTemplate from './Profile_changePassword.hbs?raw';
import formValidation from '../../utils/formValidation';

type ChangeProfilePasswordProps = {
  changeProfilePasswordControls: ((ConstructorParameters<typeof FormControl>)[0])[];
  saveDataHandler: (data: { name: string, value: string }[]) => void;
};

export default class Profile extends Block {
  constructor(props: ChangeProfilePasswordProps) {
    super({
      ...props,
      button: new Button({
        id: 'saveProfileChanges',
        text: 'Сохранить',
        type: 'submit',
      }),
      formControls: props.changeProfilePasswordControls.map((item) => new FormControl({
        label: item.label,
        type: item.type,
        value: item.value,
        inputName: item.inputName,
        publicId: item.inputName,
      }),
      ),
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
            props.saveDataHandler(formData);
          } else {
            console.log(`Form is not valid. Not valid fields - ${notValidFields.map(({ name }) => name).join(', ')}`);
            notValidFields.forEach(({ name, value }) => {
              const controlBlock = this.lists.formControls.find(fc => fc.publicId === name);
              controlBlock?.setProps({ hint: 'Невалидное значение', value });
            });
          }
        },
      },
    });
  }

  render() {
    return rawTemplate;
  }
}
