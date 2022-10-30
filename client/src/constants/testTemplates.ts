import { Template } from '../types'

export const testTemplates: Template[] = [
  {
    userId: 'test-user1',
    title: 'test-title1',
    terms: [
      {
        key: 'keyword-1',
        direction: 1,
        allowedOffset: 1,
        valueMatch: 'value-1',
        valuePrune: 'value-1',
        ignoreFirst: 1,
        maxPerPage: 1
      },
      {
        key: 'keyword-2',
        direction: 2,
        allowedOffset: 2,
        valueMatch: 'value-2',
        valuePrune: 'value-2',
        ignoreFirst: 2,
        maxPerPage: 2
      }
    ]
  },
  {
    userId: 'test-user1',
    title: 'test-title2',
    terms: [
      {
        key: 'keyword-3',
        direction: 3,
        allowedOffset: 3,
        valueMatch: 'value-3',
        valuePrune: 'value-3',
        ignoreFirst: 3,
        maxPerPage: 3
      }
    ]
  }
]
