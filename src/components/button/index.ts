import Block from '../../utils/Block';
import type { Props } from '../../utils/Block';
import './button.pcss';
import rawTemplate from './Button.hbs?raw';

interface ButtonProps extends Props {
  id?: string;
  type?: string;
  text: string;
}

export default class Button extends Block {
  constructor(props: ButtonProps) {
    super(props);
  }

  render() {
    return rawTemplate;
  }
}
