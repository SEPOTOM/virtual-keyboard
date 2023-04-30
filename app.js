import KeyLabels from './js/key-labels/key-labels.js';

const ClassNames = {
  PAGE: 'page',
};

async function initApp() {
  document.body.className = ClassNames.PAGE;

  await KeyLabels.fetch();
}

initApp();
