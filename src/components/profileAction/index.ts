import Block from '../../utils/Block';
import rawTemplate from './ProfileAction.hbs?raw';
import ActionLink from '../actionLink';

type ProfileActionProps = (ConstructorParameters<typeof ActionLink>)[0] & {
  actionClickHandler: (event: Event) => void
};

export default class ProfileAction extends Block {
  constructor(props: ProfileActionProps) {
    super({
      ...props,
      actionLink: new ActionLink(
        {
          ...props,
          attrs: {
            style: 'font-size: 13px;',
          },
          events: {
            click: props.actionClickHandler
          }
        },
      ),
    });
  }

  render() {
    return rawTemplate;
  }
}
