import { GameHandler } from '@/logic/GameHandler'

export function resetGameHandler() {
  GameHandler.getInstance().destroySingleton()
}
