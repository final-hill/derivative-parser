import { Trait, all } from "@mlhaufe/brevity/dist/index.mjs"

/**
 * Determines if the parser is the Empty parser.
 * @param {Parser} parser
 * @returns {boolean}
 */
export const isEmpty = Trait({
    [all]() { return false; },
    Empty() { return true; }
})