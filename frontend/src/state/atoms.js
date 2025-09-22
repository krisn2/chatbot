import { atom } from 'recoil'

export const userState = atom({
  key: 'userState',
  default: null
})

export const projectsState = atom({
  key: 'projectsState',
  default: []
})

export const agentsState = atom({
  key: 'agentsState',
  default: []
})