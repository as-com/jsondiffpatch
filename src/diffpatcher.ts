import Processor from './processor';
import Pipe from './pipe';
import DiffContext from './contexts/diff';
import PatchContext from './contexts/patch';
import clone from './clone';

import * as trivial from './filters/trivial';
import * as nested from './filters/nested';
import * as arrays from './filters/arrays';
import * as dates from './filters/dates';
import * as texts from './filters/texts';

import type {Config} from "./contexts/context";

class DiffPatcher {
  processor: Processor;

  constructor(options?: Config) {
    this.processor = new Processor(options);
    this.processor.pipe(
      new Pipe('diff')
        .append(
          nested.collectChildrenDiffFilter,
          trivial.diffFilter,
          dates.diffFilter,
          texts.diffFilter,
          nested.objectsDiffFilter,
          arrays.diffFilter
        )
        .shouldHaveResult()
    );
    this.processor.pipe(
      new Pipe('patch')
        .append(
          nested.collectChildrenPatchFilter,
          arrays.collectChildrenPatchFilter,
          trivial.patchFilter,
          texts.patchFilter,
          nested.patchFilter,
          arrays.patchFilter
        )
        .shouldHaveResult()
    );
  }

  options(...args) {
    return this.processor.options(...args);
  }

  diff(left, right) {
    return this.processor.process(new DiffContext(left, right));
  }

  patch(left, delta) {
    return this.processor.process(new PatchContext(left, delta));
  }

  clone(value) {
    return clone(value);
  }
}

export default DiffPatcher;
