import { Trait, all } from "@mlhaufe/brevity/dist/index.mjs"

/**
 * Determines if the parser is the Token parser.
 * @param {Parser} parser
 * @returns {boolean}
 */
export const isToken = Trait({
    [all]() { return false; },
    Token() { return true; }
})