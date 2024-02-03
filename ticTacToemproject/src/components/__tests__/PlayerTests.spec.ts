import { Player } from "@/logic/Player";
import { UserPlayer } from "@/logic/UserPlayer";
import { test, describe, beforeEach, expect } from "vitest";

let player:Player
describe('played game',()=>{
    beforeEach(()=>{
        player = new UserPlayer("test")
    })
    test('default values', ()=>{
        const stats = player.getStats()
        expectStats(stats, 0,0,0,0)
    })

    test('stats change when plays occur',()=>{
        player.playedGame(1)
        expectStats(player.getStats(), 1,0,0,1)
        player.playedGame(1)
        expectStats(player.getStats(), 2,0,0,2)
        player.playedGame(0)
        expectStats(player.getStats(), 2,1,0,3)
        player.playedGame(-1)        
        expectStats(player.getStats(), 2,1,1,4)
        expect(()=>{player.playedGame(2)}).toThrowError()
    })
})

function expectStats(stats:any, wins:number, draws:number, losses:number, games:number) {
    expect(stats.wins).toEqual(wins)
    expect(stats.draws).toEqual(draws)
    expect(stats.losses).toEqual(losses)
    expect(stats.games).toEqual(games)
}