import { invariant } from "@lapis-lang/lapis-js"
import { RegularParser } from "./RegularParser.mjs"
import { isChar } from './guards.mjs'

// ExtendedParser extends RegularParser with additional constructs
export const ExtendedParser = RegularParser.extend({
    // Represents any single character; A wildcard (.)
    Any: {},
    // Represents a range of characters (e.g., [a-z])
    Range: {
        [invariant]: ({ start, end }) => start <= end,
        start: isChar, end: isChar
    },
    // The Repetition parser. Matches the provided parser n times. (P{n})
    Rep: {
        [invariant]: ({ n }) => Number.isSafeInteger(n) && n >= 0,
        parser: RegularParser,
        n: Number
    },
    // Token parser. Matches a specific string of characters. (e.g., "hello")
    Token: {
        [invariant]: ({ value }) => typeof value === "string" && value.length > 1,
        value: String
    }
})
    .fold('containsEmpty', { out: Boolean }, {
        Rep: ({ parser, n }) => n === 0 || parser.containsEmpty
    })
    .fold('deriv', (Family) => ({ in: isChar, out: Family }), (Parser) => ({
        // D(.) = ε
        Any: () => Parser.Empty,
        // D([a-z], c) = ε if c ∈ [a-z], otherwise ∅
        Range: ({ start, end }, c) => start <= c && c <= end ? Parser.Empty : Parser.Nil,
        // Dc(P{0}) = ε
        // Dc(P{1}) = Dc(P)
        // Dc(P{n}) = Dc(P)◦P{n-1}
        Rep: ({ parser, n }, c) =>
            n === 0 ? Parser.Empty :
                n === 1 ? parser.deriv(c) :
                    parser.deriv(c).then(parser.rep(n - 1)),
        // D("abc", c) = D("a", c) ◦ "bc"
        Token: ({ value }, c) => value.length === 1 ?
            Parser.Char(value).deriv(c) :
            Parser.Char(value[0]).deriv(c).then(Parser.Token(value.substring(1))),
    }))
    .fold('equals', (Family) => ({ in: Family, out: Boolean }), {
        Any: (_, other) => other.isAny,
        Range: ({ start, end }, other) => other.isRange && start === other.start && end === other.end,
        Rep: ({ parser, n }, other) => other.isRep && n === other.n && parser.equals(other.parser),
        Token: ({ value }, other) => other.isToken && value === other.value
    })
    .fold('height', { out: Number }, {
        Any: () => 0,
        Range: () => 0,
        Rep: ({ parser, n }) => 1 + parser.height,
        Token: () => 0
    })
    .fold('isAny', { out: Boolean }, {
        Any: () => true,
        _: () => false
    })
    .fold('isAtomic', { out: Boolean }, {
        Any: () => true,
        _: () => false
    })
    .fold('isRange', { out: Boolean }, {
        Range: () => true,
        _: () => false
    })
    .fold('isRep', { out: Boolean }, {
        Rep: () => true,
        _: () => false
    })
    .fold('isToken', { out: Boolean }, {
        Token: () => true,
        _: () => false
    })
    .fold('print', { out: String }, {
        Any: () => '.',
        Range: ({ start, end }) => `[${start}-${end}]`,
        Rep: ({ parser, n }) => `${parser.print}{${n}}`,
        Token: ({ value }) => `"${value}"`
    })
    .fold('rep', (Family) => ({ in: Number, out: Family }), {
        _: ({ parser, n }, m) => Family.Rep(parser, m)
    })