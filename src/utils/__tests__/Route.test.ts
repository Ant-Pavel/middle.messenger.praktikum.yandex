/* eslint-disable @typescript-eslint/dot-notation */
import { Route } from '../Router';
import Block, { Props } from '../Block';

class MockBlock extends Block {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return '<div class="MockBlock"></div>';
  }
}

describe('Route', () => {
  let route: InstanceType<typeof Route>;

  beforeEach(() => {
    document.body.innerHTML = '<div id="test"></div>';
    route = new Route('/', MockBlock, { rootQuery: '#test' });
  });

  test('navigate call', () => {
    const renderSpy = jest.spyOn(route, 'render').mockImplementation(() => true);
    route.navigate('/');
    expect(renderSpy).toHaveBeenCalledTimes(1);
  });

  test('insertion route in the dom', () => {
    route.navigate('/');
    const componentEl = document.querySelector('.MockBlock');
    expect(componentEl).toBeInstanceOf(HTMLElement);
  });

  test('match', () => {
    expect(route.match('/')).toBe(true);
    expect(route.match('/random')).toBe(false);
  });
});
