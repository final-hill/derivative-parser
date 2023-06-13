import { Data } from "@mlhaufe/brevity/dist/index.mjs";

/**
 * Represents Parser constructs.
 */
export const Parser = Data({
    /**
     * P1 ∪ P2 - Represents the union of two parsers.
     * @constructor
     * @param {Parser} left - The left parser.
     * @param {Parser} right - The right parser.
     */
    Alt: ['left', 'right'],
    /**
     * '.' - Represents any single character. A wildcard.
     * @constructor
     */
    Any: [],
    /**
     * c - Represents a single character.
     * @constructor
     * @param {string} value - The character to match.
     */
    Char: ['value'],
    /**
     * ε - Represents the empty string.
     * @constructor
     */
    Empty: [],
    /**
     * ∅ - Represents the empty parser.
     * @constructor
     */
    Nil: [],
    /**
     * ¬P - Represents the complement of a parser.
     * @constructor
     * @param {Parser} parser - The parser to complement.
     */
    Not: ['parser'],
    /**
     * [a-b] - Represents a range of characters.
     * @constructor
     * @param {string} from - The first character in the range.
     * @param {string} to - The last character in the range.
     */
    Range: ['from', 'to'],
    /**
     * P{n} - Represents the repetition of a parser n times.
     * @constructor
     * @param {Parser} parser - The parser to repeat.
     * @param {number} n - The number of times to repeat the parser.
     */
    Rep: ['parser', 'n'],
    /**
     * P1◦P2 - Represents the concatenation of two parsers.
     * @constructor
     * @param {Parser} first - The first parser.
     * @param {Parser} second - The second parser.
     */
    Seq: ['first', 'second'],
    /**
     * P* - Represents the Kleene star of a parser.
     * @constructor
     * @param {Parser} parser - The parser to repeat.
     */
    Star: ['parser'],
    /**
     * "Foo" - Represents a token.
     * @constructor
     * @param {string} value - The token string.
     */
    Token: ['value'],
    /**
     * Simplifies the definition of parser derivatives.
     * Equivalent to either Nil or Empty depending on the parser being
     * able to parse the empty string.
     * δ(p)
     * @constructor
     * @param {Parser} parser - The parser to derive.
     */
    Nullability: ['parser'],
    /**
     * This is a helper parser. It is used for the computation of the Char derivative.
     * It can only parse the empty string (ε) where it returns the character the set of
     * parse trees.
     *
     * ε ↓ S
     * @constructor
     * @param {Set} trees - The set of parse trees.
     */
    EmptyReduction: ['trees'],
    // Maps one parse tree to another.
    // p → f
    Reduction: ['parser', 'fn']
})