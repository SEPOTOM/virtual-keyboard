import KeyLabels from './js/key-labels/key-labels.js';
import Wrapper from './components/wrapper/wrapper.js';
import Keyboard from './components/keyboard/keyboard.js';
import Text from './components/text/text.js';

const ClassNames = {
  PAGE: 'page',
};

const TextContent = {
  SYSTEM_INFO: 'Клавиатура создана в операционной системе Windows',
  LANG_INFO: 'Для смены языка нажмите левый Ctrl + левый Alt',
};

async function initApp() {
  document.body.className = ClassNames.PAGE;

  const keyLabels = await KeyLabels.fetch();

  const wrapper = Wrapper.createComponent('main');
  document.body.prepend(wrapper);

  const keyboard = Keyboard.createComponent('div');
  wrapper.append(keyboard);

  for (let key in TextContent) {
    const textBlock = Text.createComponent(TextContent[key]);
    wrapper.append(textBlock);
  }

  Keyboard.setContent(keyLabels);
}

initApp();

window.addEventListener('keydown', Keyboard.keyDown);
window.addEventListener('keyup', Keyboard.keyUp);
