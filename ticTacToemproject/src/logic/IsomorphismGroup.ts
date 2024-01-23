import { calculateCode, type GameBoard } from './GameBoard'
import {ArrayMultimap} from '@teppeis/multimaps';
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
  static getGameBoardEquiv(gameBoard: GameBoard): Set<number> {
    const equivs: Set<number> = new Set()
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
  static getNormalFormOfGameBoard(gameBoard: GameBoard): number {
    return this.getRepresentativeOfGameBoards(...this.getGameBoardEquiv(gameBoard))
  }

  /**
   * Returns the representative normal form of the gameboards in form of its code.
   * This function only gives meaningful results if all gameBoards are equivalent.
   * @param gameBoards The gameboard whose representative normal form is wanted.
   * @returns The representative normal form of the gameboard in form of its code.
   */
  static getRepresentativeOfGameBoards(...gameBoards: number[]): number {
    return Math.min(...gameBoards)
  }

  static getRepresentativeOfGameBoardsAsGB(...gameBoards: GameBoard[]): number {
    return this.getRepresentativeOfGameBoards(...gameBoards.map((gb) => gb.getCode()))
  }


  /**
   * Extracts one representative GameBoard per contained equivalence class from an array of GameBoards.
   * If there are several GameBoards per equivalence class, the GameBoard with the smallest code is selected.
   * @param gameBoards The array of GameBoards
   * @returns The array of representative GameBoards in code form
   */
  static getRepresentativesOfNonequivalentGameBoards(gameBoards: GameBoard[]): ArrayMultimap<number, GameBoard> {
    const classes: ArrayMultimap<number,GameBoard> = new ArrayMultimap()

    gameBoards.forEach((element) => {
      classes.put(element.getNormalForm(), element)
    })

    const representatives : ArrayMultimap<number,GameBoard> = new ArrayMultimap()
    classes.forEach((value,key) => {
      representatives.putAll(
        IsomorphismGroup.getRepresentativeOfGameBoardsAsGB(...classes.get(key)),
        classes.get(key)
      )
    })
    return representatives
  }
}
