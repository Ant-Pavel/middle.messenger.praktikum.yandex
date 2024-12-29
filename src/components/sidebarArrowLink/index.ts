import './sidebarArrowLink.pcss';
import Block from '../../utils/Block';
import type { Props } from '../../utils/Block';
import rawTemplate from './SidebarArrowLink.hbs?raw';

export default class SidebarArrowLink extends Block {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return rawTemplate;
  }
}
