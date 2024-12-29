import Button  from '../../components/button';
import Block from '../../utils/Block';

export default class ExamplePage extends Block {
    constructor(props) {
        super({
            ...props,
            ButtonOk: new Button({
                text: 'Okay',
                id: 'OkayId',
                events: {
                    'click': () => {
                        console.log('Okay btn click');
                    }
                },
                attrs: {
                    class: 'button'
                }
            })
        });
    }

    render() {
        return `
            <div id="examplePage">
                <h1>{{ headerText }}</h1>
                {{{ ButtonOk }}}
            </div>
        `;
    }
}
