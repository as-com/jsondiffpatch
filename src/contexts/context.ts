import Pipe from '../pipe';

export default class Context {
  hasResult: boolean;
  result: any;
  exiting: boolean;
  nextPipe: string | Pipe | undefined;
  next: any;
  root: any;
  options: any;
  children: any;
  nextAfterChildren: any;

  constructor() {
    this.hasResult = false;
    this.result = undefined;
    this.exiting = false;
    this.nextPipe = undefined;
    this.next = undefined;
    this.root = undefined;
    this.options = undefined;
    this.children = undefined;
    this.nextAfterChildren = undefined;
  }

  setResult(result) {
    this.result = result;
    this.hasResult = true;
    return this;
  }

  exit() {
    this.exiting = true;
    return this;
  }

  switchTo(next, pipe) {
    if (typeof next === 'string' || next instanceof Pipe) {
      this.nextPipe = next;
    } else {
      this.next = next;
      if (pipe) {
        this.nextPipe = pipe;
      }
    }
    return this;
  }

  push(child, name) {
    child.parent = this;
    if (typeof name !== 'undefined') {
      child.childName = name;
    }
    child.root = this.root || this;
    child.options = child.options || this.options;
    if (!this.children) {
      this.children = [child];
      this.nextAfterChildren = this.next || null;
      this.next = child;
    } else {
      this.children[this.children.length - 1].next = child;
      this.children.push(child);
    }
    child.next = this;
    return this;
  }
}
