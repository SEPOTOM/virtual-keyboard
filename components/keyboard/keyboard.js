import Language from '../../js/language/language.js';

const ClassNames = {
  KEYBOARD: 'keyboard',
  TEXTAREA: 'keyboard__textarea',
  PANEL: 'keyboard__panel',
  ROW: 'keyboard__row',
  KEY: 'keyboard__key',
  KEY_WIDE: 'keyboard__key_wide',
  KEY_DOUBLE: 'keyboard__key_double',
  BUTTON: 'keyboard__button',
  BUTTON_DARK: 'keyboard__button_dark',
  BUTTON_VISIBLE: 'keyboard__button_visible',
  BASE: 'base',
  ALT: 'alt',
  RU: 'ru',
  EN: 'en',
  SHIFT: 'shift',
  CAPS_LOCK: 'caps-lock',
  ACTIVE: 'active',
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
const RuLangSymbolCodes = [
  'Backquote',
  'BracketLeft',
  'BracketRight',
  'Semicolon',
  'Quote',
  'Comma',
  'Period',
];

const TEXTAREA_ROWS = 5;
const ROWS_QUANTITY = 5;
const KEYS_IN_FIRST_ROW_QUANTITY = 14;
const KEYS_IN_SECOND_ROW_QUANTITY = 15;
const KEYS_IN_THIRD_ROW_QUANTITY = 13;
const KEYS_IN_FOURTH_ROW_QUANTITY = 13;
const KEYS_IN_FIFTH_ROW_QUANTITY = 9;

const BUTTON_TYPE = 'button';

const numberKeys = [];
const symbolKeys = [];
const specialKeys = [];
const activeButtons = new Set();

let keyLabels = null;
let keyboardTextarea = null;
let keyboard = null;
let lang = Language.get();

let rightShiftButton = null;
let leftShiftButton = null;
let leftCtrlButton = null;
let leftAltButton = null;

let isShiftPressed = false;
let isCapsLockPressed = false;
let isLeftCtrlPressed = false;
let isLeftAltPressed = false;

function createElement(tagName, className) {
  const element = document.createElement(tagName);
  element.className = className;
  return element;
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
function registerKey(key, rowIndex, keyIndex) {
  if (rowIndex === 0 && keyIndex > 0 && keyIndex < 11) {
    numberKeys.push(key);
  } else if (key.firstElementChild.classList.contains(ClassNames.BUTTON_DARK)) {
    specialKeys.push(key);
  } else {
    symbolKeys.push(key);
  }
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

    for (let i = 0; i < keysInRowQuantity; i += 1) {
      const keyboardKey = createElement('li', ClassNames.KEY);
      keyboardRow.append(keyboardKey);

      const keyboardButton = createElement('button', ClassNames.BUTTON);
      keyboardButton.type = BUTTON_TYPE;
      keyboardKey.append(keyboardButton);

      modifyKey(keyboardKey, index, i, keysInRowQuantity);
      modifyButton(keyboardButton, index, i, keysInRowQuantity);
      registerKey(keyboardKey, index, i);
    }
  });
}
function symbolLabelsToLowerCase() {
  symbolKeys.forEach((symbolKey) => {
    if (symbolKey.dataset.code.includes('Key')
        || (RuLangSymbolCodes.includes(symbolKey.dataset.code) && lang === 'ru')) {
      const visibleButton = symbolKey.querySelector(`.${ClassNames.BUTTON_VISIBLE}`);
      visibleButton.classList.remove(ClassNames.BUTTON_VISIBLE);

      const symbolButton = symbolKey.querySelector(`.${ClassNames.BASE}.${ClassNames[lang.toUpperCase()]}`);
      symbolButton.classList.add(ClassNames.BUTTON_VISIBLE);
    }
  });
}
function symbolLabelsToUpperCase() {
  symbolKeys.forEach((symbolKey) => {
    if (symbolKey.dataset.code.includes('Key')
        || (RuLangSymbolCodes.includes(symbolKey.dataset.code) && lang === 'ru')) {
      const visibleButton = symbolKey.querySelector(`.${ClassNames.BUTTON_VISIBLE}`);
      visibleButton.classList.remove(ClassNames.BUTTON_VISIBLE);

      const symbolButton = symbolKey.querySelector(`.${ClassNames.ALT}.${ClassNames[lang.toUpperCase()]}`);
      symbolButton.classList.add(ClassNames.BUTTON_VISIBLE);
    }
  });
}
function showAltNumberButtons() {
  numberKeys.forEach((numberKey) => {
    const visibleButton = numberKey.querySelector(`.${ClassNames.BUTTON_VISIBLE}`);
    visibleButton.classList.remove(ClassNames.BUTTON_VISIBLE);

    const altButton = numberKey.querySelector(`.${ClassNames.ALT}.${ClassNames[lang.toUpperCase()]}`) || numberKey.querySelector(`.${ClassNames.ALT}`);
    altButton.classList.add(ClassNames.BUTTON_VISIBLE);
  });
}
function showAltSymbolButtons() {
  symbolKeys.forEach((symbolKey) => {
    const altButton = symbolKey.querySelector(`.${ClassNames.ALT}.${ClassNames[lang.toUpperCase()]}`) || symbolKey.querySelector(`.${ClassNames.ALT}`);
    const needSwitchLang = isLeftAltPressed && isLeftCtrlPressed;

    if (altButton && needSwitchLang
        && altButton.classList.contains(ClassNames[lang.toUpperCase()])) {
      const visibleButton = symbolKey.querySelector(`.${ClassNames.BUTTON_VISIBLE}`);
      visibleButton.classList.remove(ClassNames.BUTTON_VISIBLE);

      altButton.classList.add(ClassNames.BUTTON_VISIBLE);
    }

    if (altButton && !altButton.classList.contains(ClassNames.BUTTON_VISIBLE) && !needSwitchLang) {
      altButton.classList.add(ClassNames.BUTTON_VISIBLE);

      const visibleButton = symbolKey.querySelector(`.${ClassNames.BUTTON_VISIBLE}`);
      visibleButton.classList.remove(ClassNames.BUTTON_VISIBLE);
    }
  });
}
function showBaseSymbolButtons() {
  symbolKeys.forEach((symbolKey) => {
    const visibleButton = symbolKey.querySelector(`.${ClassNames.BUTTON_VISIBLE}`);
    visibleButton.classList.remove(ClassNames.BUTTON_VISIBLE);

    const baseButton = symbolKey.querySelector(`.${ClassNames.BASE}.${ClassNames[lang.toUpperCase()]}`) || symbolKey.querySelector(`.${ClassNames.BASE}`);
    baseButton.classList.add(ClassNames.BUTTON_VISIBLE);
  });
}
function showAltNotLetterButtons() {
  symbolKeys.forEach((symbolKey) => {
    if (symbolKey.dataset.code.includes('Key')
        || (RuLangSymbolCodes.includes(symbolKey.dataset.code) && lang === 'ru')) {
      return;
    }

    const altButton = symbolKey.querySelector(`.${ClassNames.ALT}.${ClassNames[lang.toUpperCase()]}`) || symbolKey.querySelector(`.${ClassNames.ALT}`);

    if (!altButton || altButton.classList.contains(ClassNames.BUTTON_VISIBLE)) {
      return;
    }

    altButton.classList.add(ClassNames.BUTTON_VISIBLE);

    const visibleButton = symbolKey.querySelector(`.${ClassNames.BUTTON_VISIBLE}`);
    visibleButton.classList.remove(ClassNames.BUTTON_VISIBLE);
  });
}
function updateTextareaValue(value) {
  const textareaValue = keyboardTextarea.value;
  const cursorPosition = keyboardTextarea.selectionStart;

  keyboardTextarea.value = textareaValue.slice(0, cursorPosition)
                            + value + textareaValue.slice(cursorPosition);

  keyboardTextarea.selectionStart = cursorPosition + value.length;
  keyboardTextarea.selectionEnd = cursorPosition + value.length;
}
function showBaseNumberButtons() {
  numberKeys.forEach((numberKey) => {
    const visibleButton = numberKey.querySelector(`.${ClassNames.BUTTON_VISIBLE}`);
    visibleButton.classList.remove(ClassNames.BUTTON_VISIBLE);

    const baseButton = numberKey.querySelector(`.${ClassNames.BASE}.${ClassNames[lang.toUpperCase()]}`) || numberKey.querySelector(`.${ClassNames.BASE}`);
    baseButton.classList.add(ClassNames.BUTTON_VISIBLE);
  });
}
function showBaseNotLetterButtons() {
  symbolKeys.forEach((symbolKey) => {
    if (symbolKey.dataset.code.includes('Key')
        || (RuLangSymbolCodes.includes(symbolKey.dataset.code) && lang === 'ru')) {
      return;
    }

    const visibleButton = symbolKey.querySelector(`.${ClassNames.BUTTON_VISIBLE}`);
    visibleButton.classList.remove(ClassNames.BUTTON_VISIBLE);

    const baseButton = symbolKey.querySelector(`.${ClassNames.BASE}.${ClassNames[lang.toUpperCase()]}`) || symbolKey.querySelector(`.${ClassNames.BASE}`);
    baseButton.classList.add(ClassNames.BUTTON_VISIBLE);
  });
}
function switchLang() {
  lang = lang === 'en' ? 'ru' : 'en';
  Language.set(lang);

  if (isCapsLockPressed && isShiftPressed) {
    showAltNumberButtons();
    showBaseSymbolButtons();
    showAltNotLetterButtons();
  } else if (isCapsLockPressed) {
    showAltSymbolButtons();
    showBaseNotLetterButtons();
  } else if (isShiftPressed) {
    showAltNumberButtons();
    showAltSymbolButtons();
  } else {
    showBaseSymbolButtons();
  }
}

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
    for (let i = 0; i < ROWS_QUANTITY; i += 1) {
      const keyboardRow = createElement('ul', ClassNames.ROW);
      keyboardPanel.append(keyboardRow);
      keyboardRows.push(keyboardRow);
    }

    fillKeyboardRows(keyboardRows);

    return keyboard;
  }

  static setContent(outerKeyLabels) {
    if (!outerKeyLabels && !outerKeyLabels.numbers
        && !outerKeyLabels.symbols && !outerKeyLabels.special) {
      throw new TypeError('keyLabels is not valid');
    }

    keyLabels = outerKeyLabels;

    numberKeys.forEach((numberKey, index) => {
      const localNumberKey = numberKey;
      localNumberKey.dataset.code = `Digit${keyLabels.numbers[index].base}`;

      const numberBaseButton = localNumberKey.firstElementChild;
      numberBaseButton.textContent = keyLabels.numbers[index].base;

      const numberKeyAlt = keyLabels.numbers[index].alt;

      if (typeof numberKeyAlt === 'string') {
        const numberAltButton = numberBaseButton.cloneNode();
        numberAltButton.classList.add(ClassNames.ALT);
        numberAltButton.textContent = numberKeyAlt;
        localNumberKey.append(numberAltButton);
      } else if (typeof numberKeyAlt === 'object') {
        const numberAltEnButton = numberBaseButton.cloneNode();
        numberAltEnButton.classList.add(ClassNames.ALT);
        numberAltEnButton.classList.add(ClassNames.EN);
        numberAltEnButton.textContent = numberKeyAlt.en;
        localNumberKey.append(numberAltEnButton);

        const numberAltRuButton = numberBaseButton.cloneNode();
        numberAltRuButton.classList.add(ClassNames.ALT);
        numberAltRuButton.classList.add(ClassNames.RU);
        numberAltRuButton.textContent = numberKeyAlt.ru;
        localNumberKey.append(numberAltRuButton);
      }

      numberBaseButton.classList.add(ClassNames.BASE);
      numberBaseButton.classList.add(ClassNames.BUTTON_VISIBLE);
    });

    symbolKeys.forEach((symbolKey, index) => {
      const localSymbolKey = symbolKey;
      const symbolBaseButton = localSymbolKey.firstElementChild;
      const labelContainer = keyLabels.symbols[index];
      const altLang = lang === 'en' ? 'ru' : 'en';

      if (labelContainer.code) {
        localSymbolKey.dataset.code = labelContainer.code;
      } else {
        localSymbolKey.dataset.code = `Key${labelContainer.alt.en}`;
      }

      if (typeof labelContainer.base === 'string') {
        symbolBaseButton.textContent = labelContainer.base;
      } else {
        symbolBaseButton.textContent = labelContainer.base[lang];

        const symbolAltBaseButton = symbolBaseButton.cloneNode();
        symbolAltBaseButton.textContent = labelContainer.base[altLang];
        symbolAltBaseButton.classList.add(ClassNames.BASE);
        symbolAltBaseButton.classList.add(ClassNames[altLang.toUpperCase()]);
        symbolKey.append(symbolAltBaseButton);
      }

      if (typeof labelContainer.alt === 'object') {
        const symbolAltEnButton = symbolBaseButton.cloneNode();
        symbolAltEnButton.textContent = labelContainer.alt.en;
        symbolAltEnButton.classList.add(ClassNames.ALT);
        symbolAltEnButton.classList.add(ClassNames.EN);
        symbolKey.append(symbolAltEnButton);

        const symbolAltRuButton = symbolBaseButton.cloneNode();
        symbolAltRuButton.textContent = labelContainer.alt.ru;
        symbolAltRuButton.classList.add(ClassNames.ALT);
        symbolAltRuButton.classList.add(ClassNames.RU);
        symbolKey.append(symbolAltRuButton);

        symbolBaseButton.classList.add(ClassNames[lang.toUpperCase()]);
      } else if (typeof labelContainer.alt === 'string') {
        const symbolAltButton = symbolBaseButton.cloneNode();
        symbolAltButton.textContent = labelContainer.alt;
        symbolAltButton.classList.add(ClassNames.ALT);
        symbolKey.append(symbolAltButton);
      }

      symbolBaseButton.classList.add(ClassNames.BASE);
      symbolBaseButton.classList.add(ClassNames.BUTTON_VISIBLE);
    });

    specialKeys.forEach((specialKey, index) => {
      const localSpecialKey = specialKey;
      const specialButton = specialKey.firstElementChild;
      specialButton.classList.add(ClassNames.BUTTON_VISIBLE);

      if (index === 0) {
        localSpecialKey.dataset.code = SpecialButtonCodes.BACKSPACE;
        specialButton.textContent = keyLabels.special.backspace;
      } else if (index === 1) {
        localSpecialKey.dataset.code = SpecialButtonCodes.TAB;
        specialButton.textContent = keyLabels.special.tab;
      } else if (index === 2) {
        localSpecialKey.dataset.code = SpecialButtonCodes.DEL;
        specialButton.textContent = keyLabels.special.del;
      } else if (index === 3) {
        localSpecialKey.dataset.code = SpecialButtonCodes.CAPS_LOCK;
        specialButton.textContent = keyLabels.special['caps-lock'];
      } else if (index === 4) {
        localSpecialKey.dataset.code = SpecialButtonCodes.ENTER;
        specialButton.textContent = keyLabels.special.enter;
      } else if (index === 5) {
        localSpecialKey.dataset.code = SpecialButtonCodes.LEFT_SHIFT;
        specialButton.textContent = keyLabels.special.shift;
        leftShiftButton = specialButton;
      } else if (index === 6) {
        localSpecialKey.dataset.code = SpecialButtonCodes.ARROW_UP;
        specialButton.textContent = keyLabels.special['arrow-up'];
      } else if (index === 7) {
        localSpecialKey.dataset.code = SpecialButtonCodes.RIGHT_SHIFT;
        specialButton.textContent = keyLabels.special.shift;
        rightShiftButton = specialButton;
      } else if (index === 8) {
        localSpecialKey.dataset.code = SpecialButtonCodes.LEFT_CTRL;
        specialButton.textContent = keyLabels.special.ctrl;
        leftCtrlButton = specialButton;
      } else if (index === 9) {
        localSpecialKey.dataset.code = SpecialButtonCodes.WIN;
        specialButton.textContent = keyLabels.special.win;
      } else if (index === 10) {
        localSpecialKey.dataset.code = SpecialButtonCodes.LEFT_ALT;
        specialButton.textContent = keyLabels.special.alt;
        leftAltButton = specialButton;
      } else if (index === 11) {
        localSpecialKey.dataset.code = SpecialButtonCodes.RIGHT_ALT;
        specialButton.textContent = keyLabels.special.alt;
      } else if (index === 12) {
        localSpecialKey.dataset.code = SpecialButtonCodes.ARROW_LEFT;
        specialButton.textContent = keyLabels.special['arrow-left'];
      } else if (index === 13) {
        localSpecialKey.dataset.code = SpecialButtonCodes.ARROW_DOWN;
        specialButton.textContent = keyLabels.special['arrow-down'];
      } else if (index === 14) {
        localSpecialKey.dataset.code = SpecialButtonCodes.ARROW_RIGHT;
        specialButton.textContent = keyLabels.special['arrow-right'];
      } else if (index === 15) {
        localSpecialKey.dataset.code = SpecialButtonCodes.RIGHT_CTRL;
        specialButton.textContent = keyLabels.special.ctrl;
      }
    });
  }

  static keyDown(e) {
    e.preventDefault();

    const key = keyboard.querySelector(`[data-code="${e.code}"]`);
    const button = key.querySelector(`.${ClassNames.BUTTON_VISIBLE}`);
    key.classList.add(ClassNames.ACTIVE);
    activeButtons.add(button);

    const textareaValue = keyboardTextarea.value;
    const cursorPosition = keyboardTextarea.selectionStart;

    const shiftKeyPressed = e.code === SpecialButtonCodes.RIGHT_SHIFT
                            || e.code === SpecialButtonCodes.LEFT_SHIFT;
    const capsLockKeyPressed = e.code === SpecialButtonCodes.CAPS_LOCK;
    const leftCtrlKeyPressed = e.code === SpecialButtonCodes.LEFT_CTRL;
    const leftAltKeyPressed = e.code === SpecialButtonCodes.LEFT_ALT;

    if (shiftKeyPressed && !isCapsLockPressed) {
      showAltNumberButtons();
      showAltSymbolButtons();
      isShiftPressed = true;
    } else if (shiftKeyPressed && isCapsLockPressed) {
      showBaseSymbolButtons();
      showAltNumberButtons();
      showAltNotLetterButtons();
      isShiftPressed = true;
    } else if (capsLockKeyPressed) {
      symbolLabelsToUpperCase();
    }

    if (capsLockKeyPressed && isShiftPressed && !isCapsLockPressed) {
      symbolLabelsToLowerCase();
    }

    if (leftCtrlKeyPressed) {
      isLeftCtrlPressed = true;
    }

    if (leftAltKeyPressed) {
      isLeftAltPressed = true;
    }

    if ((isLeftAltPressed && leftCtrlKeyPressed)
        || (isLeftCtrlPressed && leftAltKeyPressed)) {
      switchLang();
    }

    if (!specialKeys.includes(key) || key.dataset.code.includes('Arrow')) {
      updateTextareaValue(button.textContent);
    } else if (e.code === SpecialButtonCodes.ENTER) {
      updateTextareaValue('\n');
    } else if (e.code === SpecialButtonCodes.TAB) {
      updateTextareaValue('    ');
    } else if (e.code === SpecialButtonCodes.BACKSPACE && cursorPosition > 0) {
      keyboardTextarea.value = textareaValue.slice(0, cursorPosition - 1)
                                + textareaValue.slice(cursorPosition);
      keyboardTextarea.selectionStart = cursorPosition - 1;
      keyboardTextarea.selectionEnd = cursorPosition - 1;
    } else if (e.code === SpecialButtonCodes.DEL) {
      keyboardTextarea.value = textareaValue.slice(0, cursorPosition)
                                + textareaValue.slice(cursorPosition + 1);
      keyboardTextarea.selectionStart = cursorPosition;
      keyboardTextarea.selectionEnd = cursorPosition;
    }
  }

  static keyUp(e) {
    let currentButton = null;

    activeButtons.forEach((activeButton) => {
      const buttonParent = activeButton.parentElement;

      if (buttonParent.dataset.code === e.code) {
        currentButton = activeButton;
      }
    });

    if (!currentButton) {
      return;
    }

    const capsLockKeyUnpressed = currentButton.parentElement.dataset.code
                                    === SpecialButtonCodes.CAPS_LOCK;

    if (capsLockKeyUnpressed && isShiftPressed && !isCapsLockPressed) {
      isCapsLockPressed = true;
      return;
    }

    if (capsLockKeyUnpressed && isShiftPressed && isCapsLockPressed) {
      currentButton.parentElement.classList.remove(ClassNames.ACTIVE);
      isCapsLockPressed = false;
      symbolLabelsToUpperCase();
      return;
    }

    if (capsLockKeyUnpressed && isCapsLockPressed) {
      currentButton.parentElement.classList.remove(ClassNames.ACTIVE);
      isCapsLockPressed = false;
      symbolLabelsToLowerCase();
      return;
    }

    if (capsLockKeyUnpressed && !isCapsLockPressed) {
      isCapsLockPressed = true;
      return;
    }

    currentButton.parentElement.classList.remove(ClassNames.ACTIVE);
    activeButtons.delete(currentButton);

    const shiftKeyUnpressed = !activeButtons.has(rightShiftButton)
                              && !activeButtons.has(leftShiftButton);
    const leftCtrlKeyUnpressed = !activeButtons.has(leftCtrlButton);
    const leftAltKeyUnpressed = !activeButtons.has(leftAltButton);

    if (shiftKeyUnpressed && !isCapsLockPressed) {
      showBaseNumberButtons();
      showBaseSymbolButtons();
      isShiftPressed = false;
    } else if (shiftKeyUnpressed && isCapsLockPressed) {
      symbolLabelsToUpperCase();
      showBaseNumberButtons();
      showBaseNotLetterButtons();
      isShiftPressed = false;
    }

    if (leftCtrlKeyUnpressed) {
      isLeftCtrlPressed = false;
    }

    if (leftAltKeyUnpressed) {
      isLeftAltPressed = false;
    }
  }
}

export default Keyboard;
