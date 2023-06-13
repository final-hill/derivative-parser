import { Trait, all } from "@mlhaufe/brevity/dist/index.mjs"

/**
 * Determine if the current expression is an instance of Nil
 * @param {Parser} parser
 * @returns {boolean}
 */
export const isNil = Trait({
    [all]() { return false; },
    Nil() { return true; }
})