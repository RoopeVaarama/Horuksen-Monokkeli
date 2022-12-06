import { PDFExtractPage } from 'pdf.js-extract';

const mockPage1: PDFExtractPage = {
  pageInfo: {
    num: 1,
    scale: 1,
    rotation: 0,
    offsetX: 0,
    offsetY: 0,
    width: 595.28,
    height: 841.89,
  },
  links: [],
  content: [
    {
      x: 10,
      y: 10,
      str: 'Text 1',
      dir: 'ltr',
      width: 50,
      height: 20,
      fontName: 'g_d0_f1',
    },
    {
      x: 70,
      y: 10,
      str: 'Text 2',
      dir: 'ltr',
      width: 50,
      height: 20,
      fontName: 'g_d0_f1',
    },
    {
      x: 150,
      y: 10,
      str: 'Text 3',
      dir: 'ltr',
      width: 50,
      height: 20,
      fontName: 'g_d0_f1',
    },
    {
      x: 10,
      y: 50,
      str: 'Text 4',
      dir: 'ltr',
      width: 50,
      height: 20,
      fontName: 'g_d0_f1',
    },
    {
      x: 10,
      y: 80,
      str: 'Text 5',
      dir: 'ltr',
      width: 50,
      height: 20,
      fontName: 'g_d0_f1',
    },
  ],
};

export { mockPage1 };
