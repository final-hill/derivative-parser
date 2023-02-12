import { Trait, all } from "@mlhaufe/brevity/dist/index.mjs"

/**
 * Determines if the parser is the Rep parser.
 * @param {Parser} parser
 * @returns {boolean}
 */
export const isRep = Trait({
    [all]() { return false; },
    Rep() { return true; }
})