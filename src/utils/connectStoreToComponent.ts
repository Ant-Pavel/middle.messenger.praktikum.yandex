import Block, { Props } from './Block';
import store, { StoreEvents, type Indexed } from '@/utils/Store';
import { isEqual, cloneDeep } from './functions';
import { StoreState } from '@/utils/Store';

export default function connect(
  component: typeof Block,
  mapState: (state: Indexed, props: Props) => Indexed,
  mapStateToProps?: (state: StoreState) => void
) {
  return class extends component {
    constructor(props: Props) {
      super({ ...props });
      let localStateSnapshot = cloneDeep({ ...mapState(store.getState(), this.props) });
      store.on(StoreEvents.Updated, () => {
        const newState: Indexed = {
          ...mapState(store.getState(), this.props)
        };

        if (!isEqual(localStateSnapshot, newState)) {
          // console.log('not equal check ', localStateSnapshot, newState);
          if (mapStateToProps) {
            const func = mapStateToProps.bind(this) as (state: StoreState) => void;
            func(store.getState());
          } else {
            this.setProps(newState);
          }
          localStateSnapshot = cloneDeep(newState);
        }
      });
    }
  };
}
