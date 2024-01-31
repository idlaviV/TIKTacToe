import { calculateNextNFs } from '@/logic/GameBoardHandler'
import { describe, expect, test } from 'vitest'

describe('updateLabel', () => {
  test('first', () => {
    calculateNextNFs(10)
    expect(true).toBe(true)
  })
})
