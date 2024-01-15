import { GameHandler } from "@/logic/GameHandler";
import { AIList, updateAIList } from "@/utils/AIListExport";
import { beforeEach } from "node:test";
import { expect, test, describe } from "vitest";

let gameHandler : GameHandler = GameHandler.getInstance()

beforeEach(() => {
    GameHandler.getInstance().destroySingleton()
    gameHandler = GameHandler.getInstance()
})

describe("updateAIList", () => {
    test("generic input",() =>{
        updateAIList()
        const aIList = AIList.value
        expect(aIList.length).toEqual(3)
        expect(aIList.find((entry) => entry.player === "Human")?.index).toEqual(-1)
        expect(aIList.find((entry) => entry.player === "AI")).not.toEqual(undefined)
        expect(aIList.find((entry) => entry.player === "AI2")).not.toEqual(undefined)
    })
    test("no AIs", () => {
        gameHandler.aIs = []
        updateAIList()
        const aIList = AIList.value
        expect(aIList.length).toEqual(1)
        expect(aIList.find((entry) => entry.player === "Human")?.index).toEqual(-1)
    })
})