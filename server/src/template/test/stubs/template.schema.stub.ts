import { Template } from 'src/template/schemas/template.schema';
import { TermStub } from './term.schema.stub';

export const TemplateStub = (): Template => {
  return {
    title: 'Test Template',
    author: undefined,
    terms: [TermStub()],
  };
};

export const UpdatedTemplateStub = (): Template => {
  return {
    title: 'Updated test template',
    author: undefined,
    terms: [TermStub()],
  };
};
