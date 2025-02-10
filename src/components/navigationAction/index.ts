import Block from '../../utils/Block';
import rawTemplate from './ProfileAction.hbs?raw';
import ActionLink from '../actionLink';

type NavigationActionProps = ((ConstructorParameters<typeof ActionLink>)[0]);


export default class ProfileAction extends Block {
  constructor(props: NavigationActionProps) {
    super({
      ...props,
      actionLink: new ActionLink(props),
    });
  }

  render() {
    return rawTemplate;
  }
}
