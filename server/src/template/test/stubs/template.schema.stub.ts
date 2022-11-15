import { Template } from 'src/template/schemas/template.schema';
import { TermStub } from './term.schema.stub';

export const TemplateStub = (): Template => {
  return {
    title: 'Test Template',
    author: null,
    terms: [TermStub()],
  };
};
