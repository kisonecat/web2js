'use strict';

module.exports = class FileType {
  constructor(type) {
    this.fileType = true;
    this.type = type;
  }

  toString() {
    return `file of type ${this.type}`;
  }
};
