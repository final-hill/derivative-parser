import { Trait, all, apply } from "@mlhaufe/brevity/dist/index.mjs";
import { deriv, equals, simplify } from "./index.mjs";
import { parseEmpty } from "./parseEmpty.mjs";

/**
 * Consumes a string and produces a parse forest of all possible parses of that string.
 * @param {Parser} parser
 * @param {string} text
 * @returns {Set<string>}
 */
export const parse = Trait({
    [all](self, text) {
        // simplify self until equals returns false
        let [p, p2] = [self, simplify(self)];
        while (!equals(p, p2))
            [p, p2] = [p2, simplify(p2)];

        if (typeof text !== 'string')
            throw new Error(`Expected string, got ${typeof text}`);

        return text.length == 0 ? parseEmpty(p2) : this[apply](deriv(p2, text[0]), text.substring(1));
    }
});