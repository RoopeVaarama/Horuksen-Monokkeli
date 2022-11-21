import { RegisterDto } from './RegisterDto'

export interface UserInfo extends RegisterDto {
  [key: string]: string
  _id: string
}

export interface User {
  [key: string]: any
  token: string
  user: UserInfo
}
