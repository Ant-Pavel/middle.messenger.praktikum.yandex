import './profile.pcss';
import ProfileTable from '../../components/profileTable';
import ProfileAction from '../../components/profileAction';
import Block from '../../utils/Block';
import rawTemplate from './Profile_readData.hbs?raw';
import connect from '@/utils/connectStoreToComponent';
import store, { StoreState, UserInfoObj } from '@/utils/Store';

type ProfileProps = {
  profileFields: ((ConstructorParameters<typeof ProfileTable>)[0])['fields'];
  profileActions: ((ConstructorParameters<typeof ProfileAction>)[0])[];
};

class ProfileReadData extends Block {
  constructor(props: ProfileProps) {
    super({
      ...props,
      profileTable: new ProfileTable({
        fields: !store.getState().userInfo ? [] : store.getState().profileControls.map(({ inputName, label }) => {
          return {
            name: label,
            value: (store.getState().userInfo as UserInfoObj)[inputName as keyof UserInfoObj]
          };
        })
      }),
      profileActions: props.profileActions.map(({ id, text, link, actionClickHandler, color }) => new ProfileAction({
        id, text, link, actionClickHandler, color
      }))
    });
  }

  componentDidMount() {
    const modalComponent = this.children.modal;
    if (modalComponent) modalComponent.hide();
  }

  render() {
    return rawTemplate;
  }
}

export default connect(ProfileReadData,
  (state: Record<string, unknown>) => ({
    userInfo: state.userInfo
  }),
  function (this: ProfileReadData, state: StoreState) {
    if (!state.userInfo) return;
    this.setChildren({
      profileTable: new ProfileTable({
        fields: state.profileControls.map(({ inputName, label }) => {
          return {
            name: label,
            value: (state.userInfo as UserInfoObj)[inputName as keyof UserInfoObj]
          };
        })
      })
    });
  }
);
