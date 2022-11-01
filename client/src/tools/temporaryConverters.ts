import { Template } from '../types'

export const templatesArrayToSearch = (templates: Template[]) => {
  return templates?.[0].terms?.[0]
}
