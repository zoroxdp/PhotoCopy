import { atom } from 'recoil'

export const opponentNameAtom = atom({
  key: 'opponentName',
  default: '',
})

export const nameAtom = atom({
  key: 'name',
  default: '',
})

export const scoreAtom = atom({
  key: 'score',
  default: 0,
})

export const stateAtom = atom({
  key: 'state',
  default: [0, 0, 0],
})

export const opponentStateAtom = atom({
  key: 'opponentState',
  default: [0, 0, 0],
})

export const opponentScoreAtom = atom({
  key: 'opponentScore',
  default: 0,
})

export const resAtom = atom({
  key: 'res',
  default: false,
})
