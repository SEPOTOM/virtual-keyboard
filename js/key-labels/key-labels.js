class KeyLabels {
  static async fetch() {
    const response = await fetch('./assets/key-labels.json');
    const keyLabels = await response.json();
    this.keyLabels = keyLabels;
    return this.keyLabels;
  }

  static get() {
    return this.keyLabels;
  }
}

export default KeyLabels;
