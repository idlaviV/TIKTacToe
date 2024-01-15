import type { PlayerNumber } from './PlayerNumber'

export type FieldType = PlayerNumber | 0

/**
 * Converts a FieldType to its corresponding symbol for visualisation.
 * 1 is converted to 'X', 2 is converted to 'O' and 0 is converted to ' '.
 * @param field The FieldType to be converted to a symbol
 * @returns the corresponding symbol
 * @throws an error if the field is neither 1, 2 nor 0
 */
export function symbol(field: FieldType): string {
  if (field == 1) {
    return 'X'
  } else if (field == 2) {
    return '0'
  } else if (field == 0) {
    return ' '
  }
  throw new Error('Unexpected player in field found.')
}
