import Block from '../../utils/Block';
import type { Props } from '../../utils/Block';
import './profileTable.pcss';
import rawTemplate from './ProfileTable.hbs?raw';

interface ProfileTableProps extends Props {
  fields: { name: string, value: string }[]
}

export default class ProfileTable extends Block {
  constructor(props: ProfileTableProps) {
    super(props);
  }

  render() {
    return rawTemplate;
  }
}