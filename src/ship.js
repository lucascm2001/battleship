// linter, webpack, jest

export default class Ship {
  constructor(len) {
    this.len = len;
    this.location = [];
    this.hits = [];
  }

  hit(index) {
    this.hits.push(index);
  }

  isSunk() {
    return this.hits.length === this.len;
  }
}
