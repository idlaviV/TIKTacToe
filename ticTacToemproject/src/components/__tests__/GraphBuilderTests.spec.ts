
import { AIPlayer } from "@/logic/AIPlayer";
import { EliminationPolicy } from "@/logic/EliminationPolicy";
import { GameHandler } from "@/logic/GameHandler";
import { buildGraph, getEdges, getNodes } from "@/logic/GraphBuilder";
import { test ,describe} from "vitest";

describe('small test',()=>{
    test('test',()=>{
        GameHandler.getInstance()
        const ai : AIPlayer = new AIPlayer(new EliminationPolicy, "ai")
        buildGraph(ai)
        console.log(getNodes())
        console.log(getEdges())
    })
})