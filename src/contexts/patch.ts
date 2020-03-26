import Context from './context';

class PatchContext extends Context {
  left: any;
  delta: any;
  pipe: string;

  nested: any;

  constructor(left, delta) {
    super();
    this.left = left;
    this.delta = delta;
    this.pipe = 'patch';

    this.nested = undefined;
  }
}

export default PatchContext;
