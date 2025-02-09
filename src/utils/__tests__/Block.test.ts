/* eslint-disable @typescript-eslint/dot-notation */
import Block, { Props } from '../Block';

class MockBlock extends Block {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return '<div class="MockBlock"></div>';
  }
}



describe('Block', () => {
  MockBlock.prototype['init'] = jest.fn(MockBlock.prototype['init']);
  MockBlock.prototype['_componentDidMount'] = jest.fn(MockBlock.prototype['_componentDidMount']);
  MockBlock.prototype['_componentDidUpdate'] = jest.fn(MockBlock.prototype['_componentDidUpdate']);
  MockBlock.prototype['_render'] = jest.fn(MockBlock.prototype['_render']);
  const clickHandlerMock = jest.fn();

  const wrap = document.createElement('div');
  wrap.id = 'test';
  document.body.appendChild(wrap);
  const mockBlock = new MockBlock({
    events: {
      click: clickHandlerMock
    }
  });
  wrap.appendChild(mockBlock.getContent());

  test('lifecycle hooks are called', () => {
    expect(mockBlock['init']).toHaveBeenCalledTimes(1);
    expect(mockBlock['_render']).toHaveBeenCalledTimes(1);
    expect(mockBlock['_componentDidMount']).toHaveBeenCalledTimes(1);
    expect(mockBlock['_componentDidUpdate']).not.toHaveBeenCalled();
    mockBlock.setProps({
      a: 1
    });
    expect(mockBlock['_render']).toHaveBeenCalledTimes(2);
    expect(mockBlock['_componentDidUpdate']).toHaveBeenCalledTimes(1);
  });

  test('event listeners are attached', () => {
    const makeClick = () => {
      const mockBlockElement = document.querySelector('.MockBlock');
      mockBlockElement?.dispatchEvent(new Event('click'));
    };
    makeClick();
    expect(clickHandlerMock).toHaveBeenCalledTimes(1);
    mockBlock.setProps({
      a: 2
    });
    makeClick();
    expect(clickHandlerMock).toHaveBeenCalledTimes(2);
  });

  test('adding/removing d-none class on hiding/showing block ', () => {
    mockBlock.hide();
    expect(mockBlock.getContent().classList.contains('d-none')).toBe(true); 
    mockBlock.show();
    expect(mockBlock.getContent().classList.contains('d-none')).toBe(false);
  });
});
