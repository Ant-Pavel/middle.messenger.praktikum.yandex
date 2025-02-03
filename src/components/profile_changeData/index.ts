import './profile.pcss';
import Button from '../../components/button';
import FormControl from '../../components/formControl';
import Block from '../../utils/Block';
import rawTemplate from './Profile_changeData.hbs?raw';
import formValidation from '../../utils/formValidation';
import connect from '@/utils/connectStoreToComponent';
import store, { StoreState, UserInfoObj } from '@/utils/Store';

type ChangeProfileProps = {
  saveDataHandler: (data: { name: string, value: string }[]) => void;
};

class ProfileChangeData extends Block {
  constructor(props: ChangeProfileProps) {
    super({
      ...props,
      button: new Button({
        id: 'saveProfileChanges',
        text: 'Сохранить',
        type: 'submit',
      }),
      formControls: store.getState().userInfo ? store.getState().profileControls.map((controlSettings) => {
        return new FormControl({ ...controlSettings, value: (store.getState().userInfo as UserInfoObj)[controlSettings.inputName as keyof UserInfoObj] as string });
      }) : [],
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
      }
    });
  }

  render() {
    return rawTemplate;
  }
}

export default connect(
  ProfileChangeData,
  (state: Record<string, unknown>) => {
    return {
      userInfo: state.userInfo
    };
  },
  function (this: ProfileChangeData, state: StoreState) {
    this.setLists({
      formControls: state.profileControls.map((controlSettings) => {
        return new FormControl({ ...controlSettings, value: (state.userInfo as UserInfoObj)[controlSettings.inputName as keyof UserInfoObj] as string });
      })
    });
  }
);
