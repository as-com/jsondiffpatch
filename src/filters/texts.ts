/* global diff_match_patch */
import dmp from 'diff-match-patch';
import type DiffContext from "../contexts/diff";
import type PatchContext from "../contexts/patch";

let TEXT_DIFF = 2;
let DEFAULT_MIN_LENGTH = 60;
let cachedDiffPatch: {
  diff: (txt1: string, txt2: string) => string,
  patch: (txt1: string, patch: string) => string
} = null;

let getDiffMatchPatch = function() {
  /* jshint camelcase: false */

  if (!cachedDiffPatch) {
    let instance = new dmp();

    cachedDiffPatch = {
      diff: function(txt1, txt2) {
        return instance.patch_toText(instance.patch_make(txt1, txt2));
      },
      patch: function(txt1, patch) {
        let results = instance.patch_apply(
          instance.patch_fromText(patch),
          txt1
        );
        for (let i = 0; i < results[1].length; i++) {
          if (!results[1][i]) {
            let error = new Error('text patch failed');
            error["textPatchFailed"] = true;
          }
        }
        return results[0];
      },
    };
  }
  return cachedDiffPatch;
};

export const diffFilter = function textsDiffFilter(context: DiffContext) {
  if (context.leftType !== 'string') {
    return;
  }
  let minLength =
    (context.options &&
      context.options.textDiff &&
      context.options.textDiff.minLength) ||
    DEFAULT_MIN_LENGTH;
  if (context.left.length < minLength || context.right.length < minLength) {
    context.setResult([0, context.right]).exit();
    return;
  }
  // large text, try to use a text-diff algorithm
  let diffMatchPatch = getDiffMatchPatch();
  if (!diffMatchPatch) {
    // diff-match-patch library not available,
    // fallback to regular string replace
    context.setResult([0, context.right]).exit();
    return;
  }
  let diff = diffMatchPatch.diff;
  context.setResult([diff(context.left, context.right), 0, TEXT_DIFF]).exit();
};
diffFilter.filterName = 'texts';

export const patchFilter = function textsPatchFilter(context: PatchContext) {
  if (context.nested) {
    return;
  }
  if (context.delta[2] !== TEXT_DIFF) {
    return;
  }

  // text-diff, use a text-patch algorithm
  const patch = getDiffMatchPatch().patch;
  context.setResult(patch(context.left, context.delta[0])).exit();
};
patchFilter.filterName = 'texts';
