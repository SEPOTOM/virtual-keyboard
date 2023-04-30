const ClassNames = {
  KEYBOARD: 'keyboard',
  TEXTAREA: 'keyboard__textarea',
  PANEL: 'keyboard__panel',
  ROW: 'keyboard__row',
  KEY: 'keyboard__key',
  KEY_WIDE: 'keyboard__key_wide',
  KEY_DOUBLE: 'keyboard__key_double',
  BUTTON: 'keyboard__button',
  BUTTON_ACTIVE: 'keyboard__button_active',
  BUTTON_DARK: 'keyboard__button_dark',
};

const TEXTAREA_ROWS = 5;
const ROWS_QUANTITY = 5;
const KEYS_IN_FIRST_ROW_QUANTITY = 14;
const KEYS_IN_SECOND_ROW_QUANTITY = 15;
const KEYS_IN_THIRD_ROW_QUANTITY = 13;
const KEYS_IN_FOURTH_ROW_QUANTITY = 13;
const KEYS_IN_FIFTH_ROW_QUANTITY = 9;

const BUTTON_TYPE = 'button';

const numberButtons = [];
const symbolButtons = [];
const specialButtons = [];

class Keyboard {
  static createComponent(tagName) {
    if (!tagName && typeof tagName !== 'string') {
      throw new TypeError('tagName is not valid');
    }

    const keyboard = createElement(tagName, ClassNames.KEYBOARD);

    const keyboardTextarea = createElement('textarea', ClassNames.TEXTAREA);
    keyboardTextarea.rows = TEXTAREA_ROWS;
    keyboard.append(keyboardTextarea);

    const keyboardPanel = createElement('div', ClassNames.PANEL);
    keyboard.append(keyboardPanel);

    const keyboardRows = [];
    for ( let i = 0; i < ROWS_QUANTITY; i++ ) {
      const keyboardRow = createElement('ul', ClassNames.ROW);
      keyboardPanel.append(keyboardRow);
      keyboardRows.push(keyboardRow);
    }

    fillKeyboardRows(keyboardRows);

    return keyboard;
  }
}

function createElement(tagName, className) {
  const element = document.createElement(tagName);
  element.className = className;
  return element;
}
function fillKeyboardRows(keyboardRows) {
  keyboardRows.forEach((keyboardRow, index) => {
    let keysInRowQuantity = null;

    if (index === 0) {
      keysInRowQuantity = KEYS_IN_FIRST_ROW_QUANTITY;
    } else if (index === 1) {
      keysInRowQuantity = KEYS_IN_SECOND_ROW_QUANTITY;
    } else if (index === 2) {
      keysInRowQuantity = KEYS_IN_THIRD_ROW_QUANTITY;
    } else if (index === 3) {
      keysInRowQuantity = KEYS_IN_FOURTH_ROW_QUANTITY;
    } else if (index === 4) {
      keysInRowQuantity = KEYS_IN_FIFTH_ROW_QUANTITY;
    }

    for (let i = 0; i < keysInRowQuantity; i++ ) {
      const keyboardKey = createElement('li', ClassNames.KEY);
      keyboardRow.append(keyboardKey);

      const keyboardButton = createElement('button', ClassNames.BUTTON);
      keyboardButton.type = BUTTON_TYPE;
      keyboardKey.append(keyboardButton);

      modifyKey(keyboardKey, index, i, keysInRowQuantity);
      modifyButton(keyboardButton, index, i, keysInRowQuantity);
      registerButton(keyboardButton, index, i);
    }
  });
}
function modifyKey(key, rowIndex, keyIndex, keysInRowQuantity) {
  if (keyIndex === 0 && rowIndex !== 0 && rowIndex !== 4) {
    key.classList.add(ClassNames.KEY_WIDE);
  } else if (keyIndex === keysInRowQuantity - 1 && (rowIndex === 0 || rowIndex === 1)) {
    key.classList.add(ClassNames.KEY_WIDE);
  } else if (keyIndex === keysInRowQuantity - 1 && (rowIndex === 2 || rowIndex === 3)) {
    key.classList.add(ClassNames.KEY_DOUBLE);
  } else if (rowIndex === 4 && keyIndex === 3) {
    key.classList.add(ClassNames.KEY_WIDE);
  }
}
function modifyButton(button, rowIndex, keyIndex, keysInRowQuantity) {
  if (keyIndex === 0 && rowIndex !== 0) {
    button.classList.add(ClassNames.BUTTON_DARK);
  } else if (keyIndex === keysInRowQuantity - 1) {
    button.classList.add(ClassNames.BUTTON_DARK);
  } else if (keyIndex === keysInRowQuantity - 2 && rowIndex === 3) {
    button.classList.add(ClassNames.BUTTON_DARK);
  } else if (rowIndex === 4 && keyIndex !== 3) {
    button.classList.add(ClassNames.BUTTON_DARK);
  }
}
function registerButton(button, rowIndex, keyIndex) {
  if (rowIndex === 0 && keyIndex > 0 && keyIndex < 11) {
    numberButtons.push(button);
  } else if (button.classList.contains(ClassNames.BUTTON_DARK)) {
    specialButtons.push(button);
  } else {
    symbolButtons.push(button);
  }
}

export default Keyboard;
