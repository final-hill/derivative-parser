import { Trait, all } from "@mlhaufe/brevity/dist/index.mjs";

/**
 * Determines if the parser is the Alt parser.
 * @param {Parser} parser
 * @returns {boolean}
 */
export const isAlt = Trait({
    [all]() { return false; },
    Alt() { return true; }
})