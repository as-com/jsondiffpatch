/*

LCS implementation that supports arrays or strings

reference: http://en.wikipedia.org/wiki/Longest_common_subsequence_problem

*/

import {MatchContext} from "../contexts/context";

export type MatchFunction = (array1: any[], array2: any[], index1: number, index2: number, context: MatchContext) => boolean;

function defaultMatch(array1, array2, index1, index2) {
  return array1[index1] === array2[index2];
}

function lengthMatrix(array1: any[], array2: any[], match: MatchFunction, context: MatchContext) {
  const len1 = array1.length;
  const len2 = array2.length;
  let x, y;

  // initialize empty matrix of len1+1 x len2+1
  let matrix: number[][] = [];
  for (x = 0; x < len1 + 1; x++) {
    matrix[x] = [len2 + 1];
    for (y = 0; y < len2 + 1; y++) {
      matrix[x][y] = 0;
    }
  }

  // save sequence lengths for each coordinate
  for (x = 1; x < len1 + 1; x++) {
    for (y = 1; y < len2 + 1; y++) {
      if (match(array1, array2, x - 1, y - 1, context)) {
        matrix[x][y] = matrix[x - 1][y - 1] + 1;
      } else {
        matrix[x][y] = Math.max(matrix[x - 1][y], matrix[x][y - 1]);
      }
    }
  }
  return matrix;
}

function backtrack(matrix: number[][], match: MatchFunction, array1: any[], array2: any[], context: MatchContext): { sequence: any; indices2: any[]; indices1: any[] } {
  let index1 = array1.length;
  let index2 = array2.length;
  const subsequence = {
    sequence: [],
    indices1: [],
    indices2: [],
  };

  while (index1 !== 0 && index2 !== 0) {
    const sameLetter =
      match(array1, array2, index1 - 1, index2 - 1, context);
    if (sameLetter) {
      subsequence.sequence.unshift(array1[index1 - 1]);
      subsequence.indices1.unshift(index1 - 1);
      subsequence.indices2.unshift(index2 - 1);
      --index1;
      --index2;
    } else {
      const valueAtMatrixAbove = matrix[index1][index2 - 1];
      const valueAtMatrixLeft = matrix[index1 - 1][index2];
      if (valueAtMatrixAbove > valueAtMatrixLeft) {
        --index2;
      } else {
        --index1;
      }
    }
  }
  return subsequence;
}

function get(array1, array2, match: MatchFunction, context: MatchContext) {
  const innerContext = context;
  const matrix = lengthMatrix(
    array1,
    array2,
    match || defaultMatch,
    innerContext
  );
  const result = backtrack(
    matrix,
    match || defaultMatch,
    array1,
    array2,
    innerContext
  );
  if (typeof array1 === 'string' && typeof array2 === 'string') {
    result.sequence = result.sequence.join('');
  }
  return result;
}

export default {
  get: get,
};
