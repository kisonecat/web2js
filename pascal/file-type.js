'use strict';

module.exports = class FileType {
  constructor(type, packed) {
    this.fileType = true;
    this.type = type;
  }

  binaryen(e) {
    return Binaryen.i32;
  }

  matches(other) {
    if (other.fileType) {
      return this.type.matches(other.type);
    }

    return false;
  }

  isInteger() {
    return false;
  }
  
  bytes(e) {
    return 4;
  }
  
  initializer(e) {
    return `new FileHandle()`;
  }
  
  generate(e) {
    return `file of type ${this.type.generate(e)}`;
  }
};
