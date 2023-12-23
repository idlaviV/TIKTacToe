import { calculateCode, type GameBoard } from './GameBoard'
export class IsomorphismGroup {
  static Isomorphism = class {
    transformation: number[][][]

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

    constructor(transformation: number[][][]) {
      this.transformation = transformation
    }
  }

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

  static getGameBoardEquiv(gameBoard: GameBoard): Set<number> {
    const equivs: Set<number> = new Set()
    for (const iso of this.isomorphisms) {
      equivs.add(calculateCode(iso.apply(gameBoard.state)))
    }
    return equivs
  }
}
