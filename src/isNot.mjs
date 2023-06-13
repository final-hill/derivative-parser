import { Trait, all } from "@mlhaufe/brevity/dist/index.mjs"

/**
 * Determines if the parser is the Not parser.
 * @param {Parser} parser
 * @returns {boolean}
 */
export const isNot = Trait({
    [all]() { return false; },
    Not() { return true; }
})