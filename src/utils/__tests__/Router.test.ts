/* eslint-disable @typescript-eslint/dot-notation */
import Router, { Route } from '../Router';
import Block, { Props } from '../Block';

class MockBlock extends Block {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return '<div></div>';
  }
}

describe('Router', () => {
  let router: InstanceType<typeof Router>;

  beforeEach(() => {
    document.body.innerHTML = '<div id="test"></div>';
    router = new Router('#test');
  });

  afterEach(() => {
    document.body.innerHTML = '';
    Router['__instance'] = undefined as unknown as Router;
  });

  test('has no routes at start', () => {
    expect(router['routes']).toEqual([]);
  });

  test('adding routes', () => {
    router
      .use('/', MockBlock)
      .use('/some-page', MockBlock)
      .use('/another-page', MockBlock);

    expect(router['routes']).toHaveLength(3);
  });

  test('changing history length on route change', () => {
    router
      .use('/', MockBlock)
      .use('/first-page', MockBlock)
      .use('/second-page', MockBlock)
      .start();

    expect(router['history'].length).toBe(1);
    router.go('/first-page');
    expect(router['history'].length).toBe(2);
    router.go('/second-page');
    expect(router['history'].length).toBe(3);
    router.back();
    expect(router['history'].length).toBe(3);
  });

  test('getRoute', () => {
    router
      .use('/', MockBlock)
      .use('/first-page', MockBlock);

    expect(router.getRoute('/random-page')).toBeUndefined();
    expect(router.getRoute('/first-page')).toBeInstanceOf(Route);

  });
});
