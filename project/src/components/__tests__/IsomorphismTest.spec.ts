import { IsomorphismGroup } from '@/logic/IsomorphismGroup'
import { beforeEach, describe, expect, test } from 'vitest'
let gameBoard: number[][]
beforeEach(() => {
  gameBoard = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
  ]
})

describe('apply', () => {
  test('rotation90', () => {
    const result: number[][] = IsomorphismGroup.rotation90.apply(gameBoard)
    expect(result[0]).toEqual([3, 6, 9])
    expect(result[1]).toEqual([2, 5, 8])
    expect(result[2]).toEqual([1, 4, 7])
  })

  test('rotation180', () => {
    const result: number[][] = IsomorphismGroup.rotation180.apply(gameBoard)
    expect(result[0]).toEqual([9, 8, 7])
    expect(result[1]).toEqual([6, 5, 4])
    expect(result[2]).toEqual([3, 2, 1])
  })

  test('rotation270', () => {
    const result: number[][] = IsomorphismGroup.rotation270.apply(gameBoard)
    expect(result[0]).toEqual([7, 4, 1])
    expect(result[1]).toEqual([8, 5, 2])
    expect(result[2]).toEqual([9, 6, 3])
  })

  test('identity', () => {
    const result: number[][] = IsomorphismGroup.identity.apply(gameBoard)
    expect(result[0]).toEqual([1, 2, 3])
    expect(result[1]).toEqual([4, 5, 6])
    expect(result[2]).toEqual([7, 8, 9])
  })

  test('reflect', () => {
    const result: number[][] = IsomorphismGroup.reflect.apply(gameBoard)
    expect(result[0]).toEqual([3, 2, 1])
    expect(result[1]).toEqual([6, 5, 4])
    expect(result[2]).toEqual([9, 8, 7])
  })

  test('reflect90', () => {
    const result: number[][] = IsomorphismGroup.reflect90.apply(gameBoard)
    expect(result[0]).toEqual([1, 4, 7])
    expect(result[1]).toEqual([2, 5, 8])
    expect(result[2]).toEqual([3, 6, 9])
  })

  test('reflect180', () => {
    const result: number[][] = IsomorphismGroup.reflect180.apply(gameBoard)
    expect(result[0]).toEqual([7, 8, 9])
    expect(result[1]).toEqual([4, 5, 6])
    expect(result[2]).toEqual([1, 2, 3])
  })

  test('reflext270', () => {
    const result: number[][] = IsomorphismGroup.reflect270.apply(gameBoard)
    expect(result[0]).toEqual([9, 6, 3])
    expect(result[1]).toEqual([8, 5, 2])
    expect(result[2]).toEqual([7, 4, 1])
  })
})
