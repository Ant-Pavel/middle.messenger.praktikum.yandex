import Block from '../../utils/Block';
import type { Props } from '../../utils/Block';
import './profileAvatar.pcss';
import rawTemplate from './ProfileAvatar.hbs?raw';
import connect from '@/utils/connectStoreToComponent';
import { StoreState } from '@/utils/Store';

class ProfileAvatar extends Block {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return rawTemplate;
  }
}

export default connect(ProfileAvatar,
  (state: StoreState) => {
    return {
      userInfo: state.userInfo && ('' + state.userInfo.first_name + state.userInfo.second_name + state.userInfo.avatar)
    };
  },
  function (this: ProfileAvatar, state: StoreState) {
    this.setProps({
      avatarName: state.userInfo ? `${state.userInfo.first_name} ${state.userInfo.second_name}` : '',
      avatarImage: state.userInfo ? `${state.resourcesBasePath}${state.userInfo.avatar}` : ''
    });
  }
);
