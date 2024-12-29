import Block from '../../utils/Block';
import type { Props } from '../../utils/Block';
import './actionLink.pcss';
import rawTemplate from './ActionLink.hbs?raw';

interface ActionLinkProps extends Props {
  href?: string;
  id?: string;
  link?: string;
  color?: string
  text: string;
}

export default class ActionLink extends Block {
  constructor(props: ActionLinkProps) {
    super(props);
  }

  render() {
    return rawTemplate;
  }
}


