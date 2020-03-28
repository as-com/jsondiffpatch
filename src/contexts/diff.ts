import Context from './context';
import defaultClone from '../clone';

class DiffContext extends Context {
  left: any;
  right: any;
  pipe: string;

  leftIsArray: boolean | undefined;
  leftType: string | undefined;
  rightType: string | undefined;
  rightIsArray: boolean | undefined;

  constructor(left, right) {
    super();
    this.left = left;
    this.right = right;
    this.pipe = 'diff';

    this.leftIsArray = undefined;
    this.leftType = undefined;
    this.rightType = undefined;
    this.rightIsArray = undefined;
  }

  setResult(result) {
    if (this.options.cloneDiffValues && typeof result === 'object') {
      const clone =
        typeof this.options.cloneDiffValues === 'function'
          ? this.options.cloneDiffValues
          : defaultClone;
      if (typeof result[0] === 'object') {
        result[0] = clone(result[0]);
      }
      if (typeof result[1] === 'object') {
        result[1] = clone(result[1]);
      }
    }
    // return super.setResult(result);
    // return Context.prototype.setResult.apply(this, arguments);
    return Context.prototype.setResult.call(this, result);
  }
}

export default DiffContext;
