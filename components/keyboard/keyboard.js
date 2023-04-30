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
const SpecialButtonCodes = {
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
const activeButtons = new Set();

let keyLabels = null;
let keyboardTextarea = null;
let keyboard = null;
let lang = Language.get();

class Keyboard {
  static createComponent(tagName) {
    if (!tagName && typeof tagName !== 'string') {
      throw new TypeError('tagName is not valid');
    }

    keyboard = createElement(tagName, ClassNames.KEYBOARD);

    keyboardTextarea = createElement('textarea', ClassNames.TEXTAREA);
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
      updateButton(numberButton, keyLabels.numbers[index].base, `Digit${keyLabels.numbers[index].base}`);
    });

    symbolButtons.forEach((symbolButton, index) => {
      const labelContainer = keyLabels.symbols[index];

      if (typeof labelContainer.base === 'string') {
        symbolButton.textContent = labelContainer.base;
      } else {
        symbolButton.textContent = labelContainer.base[lang];
      }

      if (labelContainer.code) {
        symbolButton.dataset.type = labelContainer.code;
      } else {
        symbolButton.dataset.type = `Key${labelContainer.alt.en}`;
      }
    });

    specialButtons.forEach((specialButton, index) => {
      if (index === 0) {
        updateButton(specialButton, keyLabels.special.backspace, SpecialButtonCodes.BACKSPACE);
      } else if (index === 1) {
        updateButton(specialButton, keyLabels.special.tab, SpecialButtonCodes.TAB);
      } else if (index === 2) {
        updateButton(specialButton, keyLabels.special.del, SpecialButtonCodes.DEL);
      } else if (index === 3) {
        updateButton(specialButton, keyLabels.special['caps-lock'], SpecialButtonCodes.CAPS_LOCK);
      } else if (index === 4) {
        updateButton(specialButton, keyLabels.special.enter, SpecialButtonCodes.ENTER);
      } else if (index === 5) {
        updateButton(specialButton, keyLabels.special.shift, SpecialButtonCodes.LEFT_SHIFT);
      } else if (index === 6) {
        updateButton(specialButton, keyLabels.special['arrow-up'], SpecialButtonCodes.ARROW_UP);
      } else if (index === 7) {
        updateButton(specialButton, keyLabels.special.shift, SpecialButtonCodes.RIGHT_SHIFT);
      } else if (index === 8) {
        updateButton(specialButton, keyLabels.special.ctrl, SpecialButtonCodes.LEFT_CTRL);
      } else if (index === 9) {
        updateButton(specialButton, keyLabels.special.win, SpecialButtonCodes.WIN);
      } else if (index === 10) {
        updateButton(specialButton, keyLabels.special.alt, SpecialButtonCodes.LEFT_ALT);
      } else if (index === 11) {
        updateButton(specialButton, keyLabels.special.alt, SpecialButtonCodes.RIGHT_ALT);
      } else if (index === 12) {
        updateButton(specialButton, keyLabels.special['arrow-left'], SpecialButtonCodes.ARROW_LEFT);
      } else if (index === 13) {
        updateButton(specialButton, keyLabels.special['arrow-down'], SpecialButtonCodes.ARROW_DOWN);
      } else if (index === 14) {
        updateButton(specialButton, keyLabels.special['arrow-right'], SpecialButtonCodes.ARROW_RIGHT);
      } else if (index === 15) {
        updateButton(specialButton, keyLabels.special.ctrl, SpecialButtonCodes.RIGHT_CTRL);
      }
    });
  }

  static keyDown(e) {
    e.preventDefault();

    const button = keyboard.querySelector(`[data-type="${e.code}"]`);
    button.classList.add(ClassNames.BUTTON_ACTIVE);
    activeButtons.add(button);

    const textareaValue = keyboardTextarea.value;
    const cursorPosition = keyboardTextarea.selectionStart;

    if (!specialButtons.includes(button) || button.dataset.type.includes('Arrow')) {
      updateTextareaValue(button.textContent);
    } else if (e.code === SpecialButtonCodes.ENTER) {
      updateTextareaValue('\n');
    } else if (e.code === SpecialButtonCodes.TAB) {
      updateTextareaValue('    ');
    } else if (e.code === SpecialButtonCodes.BACKSPACE && cursorPosition > 0) {
      keyboardTextarea.value = textareaValue.slice(0, cursorPosition - 1) + textareaValue.slice(cursorPosition);
      keyboardTextarea.selectionStart = cursorPosition - 1;
      keyboardTextarea.selectionEnd = cursorPosition - 1;
    } else if (e.code === SpecialButtonCodes.DEL) {
      keyboardTextarea.value = textareaValue.slice(0, cursorPosition) + textareaValue.slice(cursorPosition + 1);
      keyboardTextarea.selectionStart = cursorPosition;
      keyboardTextarea.selectionEnd = cursorPosition;
    }
  }

  static keyUp(e) {
    let currentButton = null;

    activeButtons.forEach((activeButton) => {
      if (activeButton.dataset.type === e.code) {
        currentButton = activeButton;
      }
    });

    currentButton.classList.remove(ClassNames.BUTTON_ACTIVE);
    activeButtons.delete(currentButton);
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
function updateButton(button, content, type) {
  button.textContent = content;

  if (type) {
    button.dataset.type = type;
  }
}
function updateTextareaValue(value) {
  const textareaValue = keyboardTextarea.value;
  const cursorPosition = keyboardTextarea.selectionStart;

  keyboardTextarea.value = textareaValue.slice(0, cursorPosition) + value + textareaValue.slice(cursorPosition);

  keyboardTextarea.selectionStart = cursorPosition + value.length;
  keyboardTextarea.selectionEnd = cursorPosition + value.length;
}

export default Keyboard;
