// linter, webpack, jest

export default class Ship {
  constructor(len, id) {
    this.len = len;
    this.id = id;
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
