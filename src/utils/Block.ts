import EventBus from './EventBus';
import { v4 as makeUUID } from 'uuid';
import Handlebars from 'handlebars';
import type { EventBusCallback } from './EventBus';
import type { HelperOptions } from 'handlebars';

Handlebars.registerHelper('ifEquals', function (arg1, arg2, options: HelperOptions) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

export interface Props {
  events?: Record<string, (...args: unknown[]) => void>;
  attrs?: Record<string, string>;
  addIdOnElement?: boolean;
  publicId?: string
  [key: string]: unknown;
}

// export type Props = Record<string, Block | Block[] | unknown>
type Children = Record<string, Block>;
type Lists = Record<string, Block[]>;
type DataProps = Props;

export default class Block {
  static EVENTS = {
    INIT: 'init',
    FLOW_CDM: 'flow:component-did-mount',
    FLOW_CDU: 'flow:component-did-update',
    FLOW_RENDER: 'flow:render',
  };

  private _element: HTMLElement | null = null;

  private _id: string;

  protected props: DataProps;

  protected children: Children;

  protected lists: Lists;

  // для поиска элмента в списке
  readonly publicId: string;

  private eventBus: () => EventBus;

  constructor(propsAll: Props = {}) {
    this._id = makeUUID();
    const { props, children, lists } = this._handleInitialProps(propsAll);
    this.props = this._makePropsProxy(props);
    this.children = children;
    this.lists = this._makePropsProxy(lists);
    if (props.publicId) {
      this.publicId = props.publicId;
    }
    const eventBus = new EventBus();
    this.eventBus = () => eventBus;

    this._registerEvents();
    this.eventBus().emit(Block.EVENTS.INIT);
  }

  private _registerEvents(): void {
    this.eventBus().on(Block.EVENTS.INIT, this.init.bind(this) as EventBusCallback);
    this.eventBus().on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this) as EventBusCallback);
    this.eventBus().on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this) as EventBusCallback);
    this.eventBus().on(Block.EVENTS.FLOW_RENDER, this._render.bind(this) as EventBusCallback);
  }

  private init(): void {
    this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
  }

  private _componentDidMount() {
    this.componentDidMount();
  }

  // Может переопределять пользователь, необязательно трогать
  public componentDidMount() { }

  private _componentDidUpdate() {
    const response = this.componentDidUpdate();
    if (response) {
      this._render();
    }
  }

  // Может переопределять пользователь, необязательно трогать
  componentDidUpdate() {
    return true;
  }

  setProps = (nextProps: Props) => {
    if (!nextProps) {
      return;
    }

    Object.assign(this.props, nextProps);
  };

  setLists = (nextList: Record<string, Block[]>): void => {
    if (!nextList) {
      return;
    }

    Object.assign(this.lists, nextList);
  };

  get element() {
    return this._element;
  }

  private _render(): void {
    this._removeEvents();
    const templateRawStr = this.render();

    const { events, ...propsAndStubs } = this.props;

    Object.entries(this.children).forEach(([key, child]) => {
      propsAndStubs[key] = `<div data-id="${child._id}"></div>`;
    });

    Object.keys(this.lists).forEach((key) => {
      propsAndStubs[key] = `<div data-id="${key}"></div>`;
    });

    const fragment = this._createDocumentElement('template');

    const compiledTemplate = Handlebars.compile(templateRawStr);
    fragment.innerHTML = compiledTemplate(propsAndStubs);

    Object.entries(this.lists).forEach(([key, list]) => {
      const listContainer = this._createDocumentElement('template');
      list.forEach((child) => {
        listContainer.content.append(child.getContent());
      });
      const stub = fragment.content.querySelector(`[data-id="${key}"]`);
      if (stub) stub.replaceWith(listContainer.content);
    });

    Object.values(this.children).forEach((child) => {
      const stub = fragment.content.querySelector(`[data-id="${child._id}"]`);
      if (stub) stub.replaceWith(child.getContent());
    });

    const newElement = fragment.content.firstElementChild as HTMLElement;

    if (this._element) {
      this._element.replaceWith(newElement);
    }

    this._element = newElement;

    if (this.props.addIdOnElement) {
      this._element.dataset.id = this._id;
    }

    this._addEvents();
    this._addHTMLAttributes();

    this.eventBus().emit(Block.EVENTS.FLOW_CDM);
  }

  // Может переопределять пользователь, необязательно трогать
  public render() { }

  getContent(): HTMLElement {
    return this.element as HTMLElement;
  }

  private _makePropsProxy<T extends Record<string, unknown>>(props: T): T {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    return new Proxy(props, {
      set: (target, prop: string, value: T[keyof T]) => {
        const oldProps = { ...target };
        target[prop as keyof T] = value;
        const newProps = target;
        self.eventBus().emit(Block.EVENTS.FLOW_CDU, oldProps, newProps);
        return true;
      },
      deleteProperty() {
        throw new Error('Нет доступа');
      },
    });
  }

  private _createDocumentElement(tagName: string): HTMLTemplateElement {
    return document.createElement(tagName) as HTMLTemplateElement;
  }

  private _handleInitialProps(propsAll: Props) {
    const children: Children = {};
    const lists: Lists = {};
    const props: DataProps = {};

    Object.entries(propsAll).forEach(([key, value]) => {
      if (value instanceof Block) {
        children[key] = value;
      } else if (Array.isArray(value) && value.every((item) => item instanceof Block)) {
        lists[key] = value;
      } else {
        props[key] = value;
      }
    });

    return { children, props, lists };
  }

  _addEvents() {
    if (!this.props.events) return;

    const events = this.props.events;
    Object.keys(events).forEach(eventName => {
      if (eventName.includes('.')) {
        const [selector, event] = eventName.split('.');
        const el = (this._element as HTMLElement).querySelector(`[data-forEventName="${selector}"]`);
        if (el) {
          el.addEventListener(event, events[eventName]);
        }
      } else {
        (this._element as HTMLElement).addEventListener(eventName, events[eventName]);
      }
    });
  }

  _removeEvents() {
    if (!this._element) return;
    if (!this.props.events) return;

    const events = this.props.events;
    Object.keys(events).forEach(eventName => {
      if (eventName.includes('.')) {
        const [selector, event] = eventName.split('.');
        const el = (this._element as HTMLElement).querySelector(`[data-forEventName="${selector}"]`);
        if (el) {
          el.removeEventListener(event, events[eventName]);
        }
      } else {
        (this._element as HTMLElement).removeEventListener(eventName, events[eventName]);
      }
    });
  }

  _addHTMLAttributes() {
    if (!this.props.attrs) return;

    const { attrs = {} } = this.props;
    Object.entries(attrs).forEach(([key, value]) => {
      if (key === 'class') {
        (this._element as HTMLElement).classList.add(value);
      } else {
        (this._element as HTMLElement).setAttribute(key, value);
      }
    });
  }

  show() {
    this.getContent().style.display = 'block';
  }

  hide() {
    this.getContent().style.display = 'none';
  }
}
