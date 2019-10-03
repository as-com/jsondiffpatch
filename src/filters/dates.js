export const diffFilter = function datesDiffFilter(context) {
  if (context.left instanceof Date) {
    if (context.right instanceof Date) {
      if (context.left.getTime() !== context.right.getTime()) {
        context.setResult([null, context.right]);
      } else {
        context.setResult(undefined);
      }
    } else {
      context.setResult([null, context.right]);
    }
    context.exit();
  } else if (context.right instanceof Date) {
    context.setResult([null, context.right]).exit();
  }
};
diffFilter.filterName = 'dates';
