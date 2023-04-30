import Language from "../../js/language/language.js";

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
const SpecialButtonTypes = {
  BACKSPACE: 'Backspace',
  TAB: 'Tab',
  DEL: 'Delete',
  CAPS_LOCK: 'CapsLock',
  ENTER: 'Enter',
  LEFT_SHIFT: 'ShiftLeft',
  RIGHT_SHIFT: 'ShiftRight',
  LEFT_CTRL: 'ControlLeft',
  RIGHT_CTRL: 'ControlRight',
  LEFT_ALT: 'AltLeft',
  RIGHT_ALT: 'AltRight',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  WIN: 'MetaLeft',
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

let keyLabels = null;
let lang = Language.get();

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

  static setContent(outerKeyLabels) {
    if (!outerKeyLabels && !outerKeyLabels.numbers && !outerKeyLabels.symbols && !outerKeyLabels.special) {
      throw new TypeError('keyLabels is not valid');
    }

    keyLabels = outerKeyLabels;

    numberButtons.forEach((numberButton, index) => {
      numberButton.textContent = keyLabels.numbers[index].base;
    });

    symbolButtons.forEach((symbolButton, index) => {
      const labelContainer = keyLabels.symbols[index];

      if (typeof labelContainer.base === 'string') {
        symbolButton.textContent = labelContainer.base;
      } else {
        symbolButton.textContent = labelContainer.base[lang];
      }
    });

    specialButtons.forEach((specialButton, index) => {
      if (index === 0) {
        updateSpecialButton(specialButton, keyLabels.special.backspace, SpecialButtonTypes.BACKSPACE);
      } else if (index === 1) {
        updateSpecialButton(specialButton, keyLabels.special.tab, SpecialButtonTypes.TAB);
      } else if (index === 2) {
        updateSpecialButton(specialButton, keyLabels.special.del, SpecialButtonTypes.DEL);
      } else if (index === 3) {
        updateSpecialButton(specialButton, keyLabels.special['caps-lock'], SpecialButtonTypes.CAPS_LOCK);
      } else if (index === 4) {
        updateSpecialButton(specialButton, keyLabels.special.enter, SpecialButtonTypes.ENTER);
      } else if (index === 5) {
        updateSpecialButton(specialButton, keyLabels.special.shift, SpecialButtonTypes.LEFT_SHIFT);
      } else if (index === 6) {
        updateSpecialButton(specialButton, keyLabels.special['arrow-up'], SpecialButtonTypes.ARROW_UP);
      } else if (index === 7) {
        updateSpecialButton(specialButton, keyLabels.special.shift, SpecialButtonTypes.RIGHT_SHIFT);
      } else if (index === 8) {
        updateSpecialButton(specialButton, keyLabels.special.ctrl, SpecialButtonTypes.LEFT_CTRL);
      } else if (index === 9) {
        updateSpecialButton(specialButton, keyLabels.special.win, SpecialButtonTypes.WIN);
      } else if (index === 10) {
        updateSpecialButton(specialButton, keyLabels.special.alt, SpecialButtonTypes.LEFT_ALT);
      } else if (index === 11) {
        updateSpecialButton(specialButton, keyLabels.special.alt, SpecialButtonTypes.RIGHT_ALT);
      } else if (index === 12) {
        updateSpecialButton(specialButton, keyLabels.special['arrow-left'], SpecialButtonTypes.ARROW_LEFT);
      } else if (index === 13) {
        updateSpecialButton(specialButton, keyLabels.special['arrow-down'], SpecialButtonTypes.ARROW_DOWN);
      } else if (index === 14) {
        updateSpecialButton(specialButton, keyLabels.special['arrow-right'], SpecialButtonTypes.ARROW_RIGHT);
      } else if (index === 15) {
        updateSpecialButton(specialButton, keyLabels.special.ctrl, SpecialButtonTypes.RIGHT_CTRL);
      }
    });
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
function updateSpecialButton(button, content, type) {
  button.textContent = content;
  button.dataset.type = type;
}

export default Keyboard;
