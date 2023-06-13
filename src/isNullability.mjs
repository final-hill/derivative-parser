import { Trait, all } from "@mlhaufe/brevity/dist/index.mjs"

/**
 * Determines if the parser is the Nullability parser.
 * @param {Parser} parser
 * @returns {boolean}
 */

export const isNullability = Trait({
    [all](self) { return false; },
    Nullability() { return true; }
})