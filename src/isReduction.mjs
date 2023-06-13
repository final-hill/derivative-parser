import { Trait, all } from "@mlhaufe/brevity/dist/index.mjs"

/**
 * Determines if the parser is the Reduction parser.
 * @param {Parser} parser
 * @returns {boolean}
 */
export const isReduction = Trait({
    [all](self) { return false; },
    Reduction() { return true; }
})