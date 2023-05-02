class Language {
  static get() {
    return localStorage.getItem('lang') || 'en';
  }

  static set(lang) {
    if (!lang && typeof lang !== 'string') {
      throw new TypeError('lang is not valid');
    }

    localStorage.setItem('lang', lang);
  }
}

export default Language;
