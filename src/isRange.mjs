import { Trait, all } from "@mlhaufe/brevity/dist/index.mjs"

/**
 * Determines if the parser is the Range parser.
 * @param {Parser} parser
 * @returns {boolean}
 */
export const isRange = Trait({
    [all]() { return false; },
    Range() { return true; }
})