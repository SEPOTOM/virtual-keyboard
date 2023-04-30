import KeyLabels from './js/key-labels/key-labels.js';

async function initApp() {
  await KeyLabels.fetch();
}

initApp();
