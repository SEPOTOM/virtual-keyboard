import KeyLabels from './js/key-labels/key-labels.js';
import Wrapper from './components/wrapper/wrapper.js';
import Keyboard from './components/keyboard/keyboard.js';

const ClassNames = {
  PAGE: 'page',
};

async function initApp() {
  document.body.className = ClassNames.PAGE;

  const keyLabels = await KeyLabels.fetch();

  const wrapper = Wrapper.createComponent('main');
  document.body.prepend(wrapper);

  const keyboard = Keyboard.createComponent('div');
  wrapper.append(keyboard);

  Keyboard.setContent(keyLabels);
}

initApp();

window.addEventListener('keydown', function(e) {
  console.log(e);
})
