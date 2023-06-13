import { Trait, all } from "@mlhaufe/brevity/dist/index.mjs"

/**
 * Determines if the parser is the Star parser.
 * @param {Parser} parser
 * @returns {boolean}
 */
export const isStar = Trait({
    [all]() { return false; },
    Star() { return true; }
})