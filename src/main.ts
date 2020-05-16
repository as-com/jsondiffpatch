import DiffPatcher from './diffpatcher';
export {DiffPatcher};

export * as formatters from './formatters/index';

export * as console from './formatters/console';

export function create(options) {
  return new DiffPatcher(options);
}

import dateReviver from './date-reviver';
export {dateReviver};

let defaultInstance: DiffPatcher;

export function diff() {
  if (!defaultInstance) {
    defaultInstance = new DiffPatcher();
  }
  return defaultInstance.diff.apply(defaultInstance, arguments);
}

export function patch() {
  if (!defaultInstance) {
    defaultInstance = new DiffPatcher();
  }
  return defaultInstance.patch.apply(defaultInstance, arguments);
}

export function clone<T>(obj: T): T {
  if (!defaultInstance) {
    defaultInstance = new DiffPatcher();
  }
  return defaultInstance.clone(obj);
}
