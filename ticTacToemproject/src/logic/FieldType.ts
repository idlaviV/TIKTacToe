import type { PlayerNumber } from './PlayerNumber'

export type FieldType = PlayerNumber | 0

/**
 * Converts a FieldType to its corresponding symbol for visualisation.
 *    1 -> player1
 *    2 -> player2
 *    3 -> empty field
 * @param field The FieldType to be converted to a symbol
 * @returns the corresponding symbol
 * @throws an error if the field is neither 1, 2 nor 0
 */
export function symbol(field: FieldType): string {
  switch(field) {
    case 1:
      return 'X'
    case 2:
      return 'O'
    case 0:
      return ' '
  }
}
