import { Trait, all } from "@mlhaufe/brevity/dist/index.mjs"

/**
 * Determines if the parser is the EmptyReduction parser.
 * @param {Parser} parser
 * @returns {boolean}
 */
export const isEmptyReduction = Trait({
    [all](self) { return false; },
    EmptyReduction() { return true; }
})