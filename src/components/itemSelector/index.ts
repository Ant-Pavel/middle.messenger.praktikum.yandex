import Block, { Props } from '../../utils/Block';
import './itemSelector.pcss';
import rawTemplate from './ItemSelector.hbs?raw';

interface ItemSelectorProps extends Props {
  items: { id: string, name: string, chosen?: boolean }[],
  hint?: string;
}

export default class UserSelect extends Block {
  constructor(props: ItemSelectorProps) {
    super({
      ...props
    });
  }

  render() {
    return rawTemplate;
  }
}
