import './pagesNavigation.pcss';
import Block from '../../utils/Block';
import rawTemplate from './PagesNavigation.hbs?raw';
import NavigationAction from '../navigationAction';
import ActionLink from '../navigationAction';

type PagesNavigationProps = {
  navigationList: ((ConstructorParameters<typeof ActionLink>)[0])[],
  changePage: (pageId: string) => void,
};

export default class PagesNavigation extends Block {
  constructor(props: PagesNavigationProps) {
    super({
      ...props,
      navigationLinks: props.navigationList.map(({ text, link }: { id: string, text: string, link: string }) => new NavigationAction({
        text, link,
        events: {
          click: function (event: Event) {
            event.preventDefault();
            const pageName = (event.target as HTMLElement).dataset.link;
            if (pageName) {
              props.changePage(pageName);
            }
          },
        },
      })),
    });
  }

  render() {
    return rawTemplate;
  }
}
