import type DiffContext from "../contexts/diff";

export const diffFilter = function datesDiffFilter(context: DiffContext) {
  if (context.left instanceof Date) {
    if (context.right instanceof Date) {
      if (context.left.getTime() !== context.right.getTime()) {
        context.setResult([0, context.right]);
      } else {
        context.setResult(undefined);
      }
    } else {
      context.setResult([0, context.right]);
    }
    context.exit();
  } else if (context.right instanceof Date) {
    context.setResult([0, context.right]).exit();
  }
};
diffFilter.filterName = 'dates';
