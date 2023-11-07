import { getGameBoard, move } from '../../logic/GameBoardHandler'
import { GameBoard } from '../../logic/GameBoard'
import { describe, it, expect, test } from 'vitest'

import { mount } from '@vue/test-utils'
import HelloWorld from '../HelloWorld.vue'

describe('HelloWorld', () => {
  it('renders properly', () => {
    const wrapper = mount(HelloWorld, { props: { msg: 'Hello Vitest' } })
    expect(wrapper.text()).toContain('Hello Vitest')
  })
})

describe('move', ()=>{
  test('add piece to board legally', ()=>{
    move(0, 0, 1)
    expect(getGameBoard()).toEqual(new GameBoard([
      [1, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ]))
  })

  test('add piece to board illegally', ()=>{
    expect(() => move(0, 0, 2)).toThrowError('This piece cannot go there')
  })
})
