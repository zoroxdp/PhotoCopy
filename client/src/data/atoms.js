import { atom } from 'recoil'

export const opponentNameAtom = atom({
  key: 'opponentName',
  default: '',
})

export const nameAtom = atom({
  key: 'name',
  default: '',
})

export const stateAtom = atom({
  key: 'state',
  default: [0, 0, 0],
})
