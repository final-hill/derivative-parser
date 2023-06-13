import { Trait, all } from "@mlhaufe/brevity/dist/index.mjs";

/**
 * Determines if the parser is the Any parser.
 * @param {Parser} parser
 * @returns {boolean}
 */
export const isAny = Trait({
    [all]() { return false; },
    Any() { return true; }
})
