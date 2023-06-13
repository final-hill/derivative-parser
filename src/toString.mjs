import { Trait, apply, memoFix } from "@mlhaufe/brevity/dist/index.mjs";

const _toString = Trait({
    Alt({ left, right }) {
        return `Alt(${this[apply](left)}, ${this[apply](right)})`;
    },
    Any() { return 'Any' },
    Char({ value }) { return `Char('${value}')`; },
    Empty() { return 'Empty'; },
    Nil() { return 'Nil'; },
    Not({ parser }) { return `Not(${this[apply](parser)})`; },
    Range({ from, to }) { return `Range('${from}', '${to}')`; },
    Rep({ parser, n }) { return `Rep(${this[apply](parser)}, ${n})`; },
    Seq({ first, second }) {
        return `Seq(${this[apply](first)}, ${this[apply](second)})`;
    },
    Star({ parser }) { return `Star(${this[apply](parser)})`; },
    Token({ value }) { return `Token("${value}")`; },
    Nullability({ parser }) { return `Nullability(${this[apply](parser)})` },
    EmptyReduction({ trees }) { return `EmptyReduction(${[...trees]})` },
    Reduction({ parser, fn }) {
        return `Reduction(${this[apply](parser)}, ${fn})`;
    }
})

/**
 * Returns a string representation of the current expression
 * @param {Parser} parser
 * @returns {string}
 */
export const toString = memoFix(_toString, '$');