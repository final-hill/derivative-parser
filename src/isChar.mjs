import { Trait, all } from "@mlhaufe/brevity/dist/index.mjs"

/**
 * Determines if the parser is the Char parser.
 * @param {Parser} parser
 * @returns {boolean}
 */
export const isChar = Trait({
    [all]() { return false; },
    Char() { return true; }
})