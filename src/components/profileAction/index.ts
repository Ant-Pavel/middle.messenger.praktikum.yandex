import Block from '../../utils/Block';
import rawTemplate from './ProfileAction.hbs?raw';
import ActionLink from '../actionLink';

type ProfileActionProps = (ConstructorParameters<typeof ActionLink>)[0];

export default class ProfileAction extends Block {
  constructor(props: ProfileActionProps) {
    super({
      ...props,
      actionLink: new ActionLink(
        {
          id: props.id,
          text: props.text,
          attrs: {
            style: 'font-size: 13px;',
          },
          link: props.link,
          events: props.events,
        },
      ),
    });
  }

  render() {
    return rawTemplate;
  }
}
