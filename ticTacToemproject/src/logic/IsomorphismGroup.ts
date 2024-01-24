import type { GameBoardCode, NormalForm } from './Codes'
import { calculateCode, type GameBoard } from './GameBoard'
import { ArrayMultimap } from '@teppeis/multimaps'
/**
 * This class enables the calculation of equivalent gameboards and their normal forms.
 * Two gameboards are considered equivalent if one can be transformed into the other by means of rotation and/or mirroring.
 */
export class IsomorphismGroup {
  /**
   * This class represents an isomorphism between two gameboards.
   */
  static Isomorphism = class {
    transformation: number[][][]

    constructor(transformation: number[][][]) {
      this.transformation = transformation
    }

    /**
     * Applies the isomorphism to a gameboard.
     * @param state The state of the gameboard.
     * @returns The state of the transformed gameboard.
     */
    apply(state: number[][]): number[][] {
      const trafo = this.transformation
      const result = [new Array(3), new Array(3), new Array(3)]
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          result[i][j] = state[trafo[i][j][0]][trafo[i][j][1]]
        }
      }
      return result
    }
  }

  // Rotates the gameboard by 90 degrees.
  static rotation90 = new IsomorphismGroup.Isomorphism([
    [
      [0, 2],
      [1, 2],
      [2, 2]
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1]
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0]
    ]
  ])

  // Rotates the gameboard by 180 degrees.
  static rotation180 = new IsomorphismGroup.Isomorphism([
    [
      [2, 2],
      [2, 1],
      [2, 0]
    ],
    [
      [1, 2],
      [1, 1],
      [1, 0]
    ],
    [
      [0, 2],
      [0, 1],
      [0, 0]
    ]
  ])

  // The gameboard as it is.
  static identity = new IsomorphismGroup.Isomorphism([
    [
      [0, 0],
      [0, 1],
      [0, 2]
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2]
    ],
    [
      [2, 0],
      [2, 1],
      [2, 2]
    ]
  ])

  // Rotates the gameboard by 270 degrees.
  static rotation270 = new IsomorphismGroup.Isomorphism([
    [
      [2, 0],
      [1, 0],
      [0, 0]
    ],
    [
      [2, 1],
      [1, 1],
      [0, 1]
    ],
    [
      [2, 2],
      [1, 2],
      [0, 2]
    ]
  ])

  // Reflects the gameboard.
  static reflect = new IsomorphismGroup.Isomorphism([
    [
      [0, 2],
      [0, 1],
      [0, 0]
    ],
    [
      [1, 2],
      [1, 1],
      [1, 0]
    ],
    [
      [2, 2],
      [2, 1],
      [2, 0]
    ]
  ])

  // Reflects the gameboard and rotates it by 90 degrees.
  static reflect90 = new IsomorphismGroup.Isomorphism([
    [
      [0, 0],
      [1, 0],
      [2, 0]
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1]
    ],
    [
      [0, 2],
      [1, 2],
      [2, 2]
    ]
  ])

  // Reflects the gameboard and rotates it by 180 degrees.
  static reflect180 = new IsomorphismGroup.Isomorphism([
    [
      [2, 0],
      [2, 1],
      [2, 2]
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2]
    ],
    [
      [0, 0],
      [0, 1],
      [0, 2]
    ]
  ])

  // Reflects the gameboard and rotates it by 270 degrees.
  static reflect270 = new IsomorphismGroup.Isomorphism([
    [
      [2, 2],
      [1, 2],
      [0, 2]
    ],
    [
      [2, 1],
      [1, 1],
      [0, 1]
    ],
    [
      [2, 0],
      [1, 0],
      [0, 0]
    ]
  ])

  /**
   * List of every possible isomorphism transformation
   */
  static isomorphisms = [
    IsomorphismGroup.identity,
    IsomorphismGroup.rotation90,
    IsomorphismGroup.rotation180,
    IsomorphismGroup.rotation270,
    IsomorphismGroup.reflect,
    IsomorphismGroup.reflect90,
    IsomorphismGroup.reflect180,
    IsomorphismGroup.reflect270
  ]

  /**
   * Returns a list of all equivalent gameboards in the form of their code.
   * The identity is also included.
   * @param gameBoard The gameboard whose equivalent gameboards are wanted.
   * @returns A set of all equivalent gameboards.
   */
  static getGameBoardEquiv(gameBoard: GameBoard): Set<GameBoardCode> {
    const equivs: Set<GameBoardCode> = new Set()
    for (const iso of this.isomorphisms) {
      equivs.add(calculateCode(iso.apply(gameBoard.state)))
    }
    return equivs
  }

  /**
   * Returns the normal form of the gameboard in form of its code.
   * @param gameBoard The gameboard whose normal form is wanted.
   * @returns The normal form of the gameboard.
   */
  static getNormalFormOfGameBoard(gameBoard: GameBoard): NormalForm {
    return IsomorphismGroup.getRepresentativeOfGameBoards(
      Array.from(IsomorphismGroup.getGameBoardEquiv(gameBoard))
    )
  }

  /**
   * Returns the representative normal form of the gameboards in form of its code.
   * This function only gives meaningful results if all gameBoards are equivalent.
   * @param gameBoards The gameboard whose representative normal form is wanted.
   * @returns The representative normal form of the gameboard in form of its code.
   */
  static getRepresentativeOfGameBoards(gameBoards: GameBoardCode[]): GameBoardCode {
    return Math.min(...gameBoards)
  }

  static getRepresentativeOfGameBoardsAsGameBoard(gameBoards: GameBoard[]): GameBoard {
    return gameBoards.reduce((previousValue, currentValue) => {
      if (previousValue.getCode() < currentValue.getCode()) {
        return previousValue
      } else {
        return currentValue
      }
    })
  }

  /**
   * Extracts one representative gameBoard per equivalence class.
   * The chosen gameBoard is the gameBoard with the minimal code.
   * If there are several GameBoards per equivalence class, the GameBoard with the smallest code is selected.
   * @param classes The equivalence classes, indexed by their normal form
   * @returns A map from the normal form of each class to the representative GameBoard
   */
  static getRepresentativeOfEquivalenceClasses(
    classes: ArrayMultimap<NormalForm, GameBoard>
  ): Map<NormalForm, GameBoard> {
    const representatives: Map<NormalForm, GameBoard> = new Map()
    classes.asMap().forEach((value, key) => {
      representatives.set(key, IsomorphismGroup.getRepresentativeOfGameBoardsAsGameBoard(value))
    })
    return representatives
  }

  /**
   * Calculates the equivalence classes of the given GameBoards.
   * @param gameBoards The array of GameBoards
   * @returns maps the normal form of each class to the GameBoards in that class
   */
  static getEquivalenceClassesOfGameBoards(
    gameBoards: GameBoard[]
  ): ArrayMultimap<NormalForm, GameBoard> {
    const classes: ArrayMultimap<NormalForm, GameBoard> = new ArrayMultimap()

    gameBoards.forEach((element) => {
      classes.put(element.getNormalForm(), element)
    })
    return classes
  }
}
