import Pipe from '../pipe';
import type DiffContext from './diff';
import PatchContext from "./patch";

export interface MatchContext {
  objectHash: any;
  matchByPosition: boolean;
  hashCache1: any;
  hashCache2: any;
}

export interface Config {
  // used to match objects when diffing arrays, by default only === operator is used
  objectHash?: (item: any, index: number) => string;

  arrays?: {
    // default true, detect items moved inside the array (otherwise they will be registered as remove+add)
    detectMove: boolean,
    // default false, the value of items moved is not included in deltas
    includeValueOnMove: boolean,
  };

  textDiff?: {
    // default 60, minimum string length (left and right sides) to use text diff algorythm: google-diff-match-patch
    minLength: number,
  };

  /**
   * this optional function can be specified to ignore object properties (eg. volatile data)
   * @param name property name, present in either context.left or context.right objects
   * @param context the diff context (has context.left and context.right objects)
   */
  /**
   *
   */
  propertyFilter?: (name: string, context: DiffContext) => boolean;

  /**
   *  default false. if true, values in the obtained delta will be cloned (using jsondiffpatch.clone by default),
   *  to ensure delta keeps no references to left or right objects. this becomes useful if you're diffing and patching
   *  the same objects multiple times without serializing deltas.
   *
   *  instead of true, a function can be specified here to provide a custom clone(value)
   */
  cloneDiffValues?: boolean | ((value: any) => any);
}

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
  parent: Context;
  childName: any;

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
    this.parent = undefined;
    this.childName = undefined;
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

  push(child: Context, name: any) {
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
