import Block from '../../utils/Block';
import type { Props } from '../../utils/Block';
import './modal.pcss';
import rawTemplate from './Modal.hbs?raw';
import Button from '../button';
import actionLink from '../actionLink';

interface ModalProps extends Props {
  btnText: string;
  actionLinkText: string;
}

export default class Modal extends Block {
  constructor(props: ModalProps) {
    super({
      ...props,
      button: new Button({
        text: props.btnText,
      }),
      actionLink: new actionLink({
        text: props.actionLinkText,
        attrs: {
          style: 'font-size: 12px; line-height: 16px;',
        },
      }),
    });
  }

  render() {
    return rawTemplate;
  }
}
