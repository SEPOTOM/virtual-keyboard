const ClassNames = {
  WRAPPER: 'wrapper',
};

class Wrapper {
  static createComponent(tagName) {
    if (!tagName && typeof tagName !== 'string') {
      throw new TypeError('tagName is not valid');
    }

    const wrapper = document.createElement(tagName);
    wrapper.className = ClassNames.WRAPPER;

    return wrapper;
  }
}

export default Wrapper;
