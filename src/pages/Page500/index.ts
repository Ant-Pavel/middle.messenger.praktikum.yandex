import './500.pcss';
import ActionLink from '../../components/actionLink';
import PagesNavigation from '../../components/pagesNavigation';
import Block from '../../utils/Block';
import rawTemplate from './Page500.hbs?raw';

type Page500Props = {
  changePage: (pageId: string) => void,
  navigationList: ((ConstructorParameters<typeof PagesNavigation>)[0])['navigationList']
};


export default class Profile extends Block {
  constructor(props: Page500Props) {
    super({
      ...props,
      homeLink: new ActionLink(
        {
          id: 'page500Homelink',
          text: 'Назад к чатам',
          link: 'Chat',
          events: {
            click: function (event: Event) {
              event.preventDefault();
              const link = (event.target as HTMLElement).dataset.link;
              if (link) {
                props.changePage(link);
              }
            },
          },
        },
      ),
      pagesNavigation: new PagesNavigation({ navigationList: props.navigationList, changePage: props.changePage }),
    });
  }

  render() {
    return rawTemplate;
  }
}