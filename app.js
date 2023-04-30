import KeyLabels from './js/key-labels/key-labels.js';
import Wrapper from './components/wrapper/wrapper.js';
import Keyboard from './components/keyboard/keyboard.js';

const ClassNames = {
  PAGE: 'page',
};

async function initApp() {
  document.body.className = ClassNames.PAGE;

  await KeyLabels.fetch();

  const wrapper = Wrapper.createComponent('main');
  document.body.prepend(wrapper);

  const keyboard = Keyboard.createComponent('div');
  wrapper.append(keyboard);
}

initApp();
