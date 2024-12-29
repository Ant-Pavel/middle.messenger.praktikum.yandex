import Block from '../../utils/Block';
import type { Props } from '../../utils/Block';
import './profileAvatar.pcss';
import rawTemplate from './ProfileAvatar.hbs?raw';

export default class ProfileAvatar extends Block {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return rawTemplate;
  }
}