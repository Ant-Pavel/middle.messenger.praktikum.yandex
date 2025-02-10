
import Block from '@/utils/Block';
import type { Props as BlockProps } from '@/utils/Block';

type Props = {
  rootQuery: string;
  [key: string]: unknown
};

export class Route {
  private _pathname: string;

  private _blockClass: typeof Block;

  private _block: InstanceType<typeof Block> | null;

  private _props: Props;

  constructor(pathname: string, view: typeof Block, props: Props) {
    this._pathname = pathname;
    this._blockClass = view;
    this._block = null;
    this._props = props;
  }

  navigate(pathname: string) {
    if (this.match(pathname)) {
      this._pathname = pathname;
      this.render();
    }
  }

  leave() {
    if (this._block) {
      this._block.hide();
    }
  }

  match(pathname: string) {
    return pathname === this._pathname;
  }

  render() {
    if (!this._block) {
      this._block = new this._blockClass(this._props);
      const root = document.querySelector(this._props.rootQuery) as HTMLDivElement;
      root.appendChild(this._block.getContent());

      return;
    }

    this._block.show();
  }
}

export default class Router {
  static __instance: InstanceType<typeof Router>;

  private routes: Route[];

  private history: History;

  private _currentRoute: Route | null;

  private _rootQuery: string;

  constructor(rootQuery?: string) {
    if (Router.__instance) {
      return Router.__instance;
    }

    this.routes = [];
    this.history = window.history;
    this._currentRoute = null;
    this._rootQuery = rootQuery as string;

    Router.__instance = this;
  }

  use(pathname: string, block: typeof Block, props?: BlockProps) {
    const route = new Route(pathname, block, { ...props, rootQuery: this._rootQuery });

    this.routes.push(route);

    return this;
  }

  start() {
    window.onpopstate = ((event: PopStateEvent) => {
      this._onRoute((event.currentTarget as Window).location.pathname);
    });

    this._onRoute(window.location.pathname);
  }

  _onRoute(pathname: string) {
    const route = this.getRoute(pathname);
    if (!route) {
      return;
    }

    if (this._currentRoute && this._currentRoute !== route) {
      this._currentRoute.leave();
    }

    this._currentRoute = route;
    route.render();
  }

  go(pathname: string) {
    this.history.pushState({}, '', pathname);
    this._onRoute(pathname);
  }

  back() {
    this.history.back();
  }

  forward() {
    this.history.forward();
  }

  getRoute(pathname: string) {
    return this.routes.find(route => route.match(pathname));
  }
}
