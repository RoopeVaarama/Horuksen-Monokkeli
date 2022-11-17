import { Template } from '../types'

export const titleAlreadyExists = (templates: Template[], title: string, id?: string) => {
  return templates.find((template) => template.title === title && template._id !== id)
}
