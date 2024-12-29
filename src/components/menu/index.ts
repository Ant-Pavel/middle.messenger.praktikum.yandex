import Block from '../../utils/Block';
import type { Props } from '../../utils/Block';
import './menu.pcss';
import rawTemplate from './Menu.hbs?raw';

export default class Menu extends Block {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return rawTemplate;
  }
}
