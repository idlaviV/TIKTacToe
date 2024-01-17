import { ref } from "vue";

const leftScreen = ref("SelectionScreen")

export function setLeftScreen(screen: string) {
  leftScreen.value = screen
}

export function getLeftScreen() {
  return leftScreen.value
}
