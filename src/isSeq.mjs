import { Trait, all } from "@mlhaufe/brevity/dist/index.mjs";

/**
 * Determines if the parser is the Seq parser.
 * @param {Parser} parser
 * @returns {boolean}
 */
export const isSeq = Trait({
    [all]() { return false; },
    Seq() { return true; }
})