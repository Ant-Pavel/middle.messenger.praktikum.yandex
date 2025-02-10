import Block from '@/utils/Block';
import type { Props } from '@/utils/Block';
import '../common.pcss';
import './addFileModal.pcss';
import rawTemplate from './AddFileModal.hbs?raw';
import Button from '@/components/button';

interface ModalProps extends Props {
  btnText: string;
  actionLinkText: string;
  fileInputName: string;
  addFileModalHandler: (val: FormData) => unknown;
}

export default class Modal extends Block {
  constructor(props: ModalProps) {
    super({
      ...props,
      button: new Button({
        text: props.btnText,
        type: 'submit'
      }),
      hasFile: false,
      chosenFileName: '',
      header: 'Загрузите файл',
      hint: '',
      fileInputName: props.fileInputName,
      chosenFile: null,
      events: {
        ...props.events,
        'modalForm.submit': (event: Event) => {
          event.preventDefault();

          if (!this.props.hasFile) {
            this.setProps({
              hint: 'Нужно выбрать файл'
            });
            return;
          }

          const formData = new FormData();
          formData.append(props.fileInputName, this.props.chosenFile as Blob);

          props.addFileModalHandler(formData);
        },
        'userAvatarInput.change': (event: Event) => {
          const { files } = event.target as HTMLInputElement;
          if (files && files.length) {
            this.setProps({
              hasFile: true,
              chosenFileName: files[0].name,
              header: 'Файл загружен',
              chosenFile: files[0],
              hint: ''
            });
          }
        },
        'overlay.click': (event: Event) => {
          if (event.target !== event.currentTarget) return;
          this.reset();
          this.hide();
        }
      }
    });
  }

  reset() {
    this.setProps({
      hasFile: false,
      chosenFileName: '',
      header: 'Загрузите файл',
      hint: '',
      chosenFile: 0
    });
  }

  render() {
    return rawTemplate;
  }
}
