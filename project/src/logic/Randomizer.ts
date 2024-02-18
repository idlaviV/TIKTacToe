export class Randomizer {
  /**
   * Returns a random integer in a range.
   * @param min exclusive lower bound
   * @param max inclusive upper bound
   */
  randomInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
}
