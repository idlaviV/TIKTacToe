import { TTTEdge, TTTNode, type TTTNodes } from "./Graph";
import * as gc from '@/components/GraphConstants'

export const explainNodes : TTTNodes = {
    0: new TTTNode(
      0,
      [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      0,
      false
    ),
    1: new TTTNode(
      1,
      [
        [1, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      1,
      false
    ),
    10: new TTTNode(
      10,
      [
        [0, 1, 0],
        [0, 0, 0],
        [0, 0, 0]
      ],
      1,
      false
    ),
    10000: new TTTNode(
      10000,
      [
        [0, 0, 0],
        [0, 1, 0],
        [0, 0, 0]
      ],
      1,
      false
    )
  }

  export const explainEdges = {
    '0#1': new TTTEdge('0', '1', '0#1', 0, 0, 1),
    '0#10': new TTTEdge('0', '10', '0#10', 0, 0, 10),
    '0#10000': new TTTEdge('0', '10000', '0#10000', 0, 0, 10000)
  }
  export const explainLabels: Record<string, string> = {
    '0#1': '0',
    '0#10': '1',
    '0#10000': '2'
  }
  export const explainLayouts = {
    nodes: {
      0: { x: 0, y: 0 },
      1: { x: -3 * gc.nodeSize, y: 3 * gc.nodeSize },
      10: { x: 0, y: 3 * gc.nodeSize },
      10000: { x: 3 * gc.nodeSize, y: 3 * gc.nodeSize }
    }
  }