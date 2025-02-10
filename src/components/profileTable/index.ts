import Block from '../../utils/Block';
import type { Props } from '../../utils/Block';
import './profileTable.pcss';
import rawTemplate from './ProfileTable.hbs?raw';
// import connect from '@/utils/connectStoreToComponent';

interface ProfileTableProps extends Props {
  fields: { name: string, value: string | number | null }[]
}

export default class ProfileTable extends Block {
  constructor(props: ProfileTableProps) {
    super(props);
  }

  render() {
    return rawTemplate;
  }
}

// export default connect(ProfileTable, (state: Record<string, unknown>) => {
//   return {
//     fields: state.profileTableData
//   };
// });
