const ClassNames = {
  TEXT: 'text',
};

class Text {
  static createComponent(value) {
    if (!value && typeof value !== 'string') {
      throw new TypeError('value is not valid');
    }

    const component = document.createElement('p');
    component.className = ClassNames.TEXT;
    component.textContent = value;

    return component;
  }
}

export default Text;
