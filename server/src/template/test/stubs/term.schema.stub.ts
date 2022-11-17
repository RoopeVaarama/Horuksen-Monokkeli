import { Term } from 'src/template/schemas/term.schema';

export const TermStub = (): Term => {
  return {
    key: 'STUB',
    keyOnly: false,
    direction: 1,
    allowedOffset: 10,
    valueMatch: '.*',
    valuePrune: '.*',
    ignoreFirst: 0,
    maxPerPage: 0,
  };
};
