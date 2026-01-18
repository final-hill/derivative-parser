import { data } from "@lapis-lang/lapis-js"
import { isChar } from './guards.mjs'

// RegularParser represents the abstract syntax tree for regular expressions
export const RegularParser = data(({ Family }) => ({
    // Represents the union of two parsers (P1 ∪ P2)
    Alt: { left: Family, right: Family },
    // Represents any single character. A wildcard. (.)
    Any: {},
    // Represents the concatenation of two parsers (P1 ◦ P2)
    Cat: { first: Family, second: Family },
    // Represents a single character parser (e.g., 'a')
    Char: { value: isChar },
    // Represents the Empty parser which matches the empty string (ε = {""})
    Empty: {},
    // The Nil Parser ∅. Matches nothing. (∅ = {})
    Nil: {},
    // Represents the negation (complement) of a parser (¬P)
    // Matches anything that is not the provided parser
    Not: { parser: Family },
    // Represents the Kleene star of the given language (P*)
    Star: { parser: Family }
}))
    // Determines if the current language contains Empty
    .fold('containsEmpty', { out: Boolean }, {
        // δ(L1 | L2) = δ(L1) | δ(L2)
        Alt: ({ left, right }) => left.containsEmpty || right.containsEmpty,
        Any: () => false,
        // δ(P1◦P2) = δ(P1)◦δ(P2)
        Cat: ({ first, second }) => first.containsEmpty && second.containsEmpty,
        Char: () => false,
        Empty: () => true,
        Nil: () => false,
        Not: ({ parser }) => !parser.containsEmpty,
        Star: () => true,
        _: () => false
    })
    /*
     * Computes the derivative of a regular language with respect to a character c.
     * The derivative is a new language where all strings that start with the character
     * are retained. The prefix character is then removed.
     */
    .fold('deriv', (Family) => ({ in: isChar, out: Family }), (Parser) => ({
        // Dc(L1 ∪ L2) = Dc(L1) ∪ Dc(L2)
        Alt: ({ left, right }, c) => left.deriv(c).or(right.deriv(c)),
        Any: (_, _c) => Parser.Empty,
        // Dc(P1◦P2) = (Dc(P1)◦P2) ∪ (δ(P1)◦Dc(P2))
        Cat: ({ first, second }, c) => first.deriv(c).then(second).or(first.nilOrEmpty.then(second.deriv(c))),
        // Dc(c) = ε
        // Dc(c') = ∅
        Char: ({ value }, c) => value === c ? Parser.Empty : Parser.Nil,
        // Dc(ε) = ∅
        Empty: () => Parser.Nil,
        // Dc(∅) = ∅
        Nil: () => Parser.Nil,
        // Dc(¬P) = ¬Dc(P)
        Not: ({ parser }, c) => parser.deriv(c).not,
        // Dc(L*) = Dc(L) ◦ L*
        Star: ({ parser }, c) => parser.deriv(c).then(parser.star)
    }))
    // Determines if the current Parser is equal the provided one
    .fold('equals', (Family) => ({ in: Family, out: Boolean }), {
        Alt: ({ left, right }, other) => other.isAlt && left.equals(other.left) && right.equals(other.right),
        Any: (_, other) => other.isAny,
        Cat: ({ first, second }, other) => other.isCat && first.equals(other.first) && second.equals(other.second),
        Char: ({ value }, other) => other.isChar && other.value === value,
        Empty: (_, other) => other.isEmpty,
        Nil: (_, other) => other.isNil,
        Not: ({ parser }, other) => other.isNot && parser.equals(other.parser),
        Star: ({ parser }, other) => other.isStar && parser.equals(other.parser)
    })
    // The height of the expression tree. This is used for simplification.
    .fold('height', { out: Number }, {
        Alt: ({ left, right }) => Math.max(left.height, right.height) + 1,
        Any: () => 0,
        Cat: ({ first, second }) => Math.max(first.height, second.height) + 1,
        Char: () => 1,
        Empty: () => 0,
        Nil: () => 0,
        Not: ({ parser }) => parser.height + 1,
        Star: ({ parser }) => parser.height + 1
    })
    .fold('isAlt', { out: Boolean }, {
        Alt: () => true,
        _: () => false
    })
    .fold('isAny', { out: Boolean }, {
        Any: () => true,
        _: () => false
    })
    // Determine if the current expression is an instance of Char | Empty | Nil
    .fold('isAtomic', { out: Boolean }, {
        Any: () => true,
        Char: () => true,
        Empty: () => true,
        Nil: () => true,
        _: () => false
    })
    .fold('isCat', { out: Boolean }, {
        Cat: () => true,
        _: () => false
    })
    .fold('isChar', { out: Boolean }, {
        Char: () => true,
        _: () => false
    })
    .fold('isEmpty', { out: Boolean }, {
        Empty: () => true,
        _: () => false
    })
    .fold('isNil', { out: Boolean }, {
        Nil: () => true,
        _: () => false
    })
    .fold('isNot', { out: Boolean }, {
        Not: () => true,
        _: () => false
    })
    .fold('isStar', { out: Boolean }, {
        Star: () => true,
        _: () => false
    })
    // Determines if the provided text matches the current expression
    .fold('matches', { in: String, out: Boolean }, {
        _: (self, text) => text.length === 0 ? self.containsEmpty :
            self.deriv(text[0]).matches(text.substring(1))
    })
    // Returns Nil or Empty depending on whether Empty
    // exists in the current expression.
    // δ(L) = ∅ if ε notIn L
    // δ(L) = ε if ε in L
    .fold('nilOrEmpty', (Family) => ({ out: Family }), {
        Alt: ({ left, right }) => left.nilOrEmpty.or(right.nilOrEmpty),
        Cat: ({ first, second }) => first.nilOrEmpty.then(second.nilOrEmpty),
        // δ(¬P) = ε if δ(P) = ∅
        // δ(¬P) = ∅ if δ(P) = ε
        Not: ({ parser }) => parser.nilOrEmpty.isNil ? Family.Empty : Family.Nil,
        Empty: () => Family.Empty,
        // δ(L*) = ε
        Star: () => Family.Empty,
        _: () => Family.Nil
    })
    // Combinator for the negation of a parser
    .fold('not', (Family) => ({ out: Family }), {
        _: (self) => Family.Not(self)
    })
    // The Opt parser. Matches zero or one occurrence of the current parser
    // P?
    // Equivalent to P | ε
    .fold('opt', (Family) => ({ out: Family }), {
        _: (self) => Family.Alt(self, Family.Empty)
    })
    // Combinator for the union of two parsers
    .fold('or', (Family) => ({ in: Family, out: Family }), {
        _: (self, other) => Family.Alt(self, other)
    })
    // The Plus parser. Matches the current pattern one or more times
    // P+
    // Equivalent to P◦P*
    .fold('plus', (Family) => ({ out: Family }), {
        _: (self) => Family.Cat(self, self.star())
    })
    // Converts the current Parser to simplest form possible
    // Where 'simplify' is defined as minimizing the height of the expression tree.
    // Additionally, this method will refactor the expression so that other
    // methods will be more likely to short-circuit.
    .fold('simplify', (Family) => ({ out: Family }), (Family) => ({
        // L ∪ L → L
        // M ∪ L → L ∪ M
        // ∅ ∪ L → L
        // L ∪ ∅ → L
        // (L ∪ M) ∪ N → L ∪ (M ∪ N)
        Alt: ({ left, right }) => {
            const l = left.simplify(),
                r = right.simplify();

            if (l.isAlt())
                return Family.Alt(l.left, Family.Alt(l.right, r)).simplify();

            if (l.height() > r.height())
                return Family.Alt(r, l);

            if (l.equals(r))
                return l;
            else if (l.isNil())
                return r;
            else if (r.isNil())
                return l;

            return Family.Alt(l, r);
        },
        // PƐ → ƐP → P
        // ∅P → P∅ → ∅
        // Unused: (PQ)R → P(QR)
        // Unused: P(Q ∪ R) → PQ ∪ PR  (Is this actually simpler? Maybe the other direction?)
        // Unused: (Q ∪ R)P → QP ∪ RP  (Is this actually simpler? Maybe the other direction?)
        Cat: ({ first, second }) => {
            const f = first.simplify,
                s = second.simplify;

            if (f.isEmpty)
                return s;
            else if (s.isEmpty)
                return f;
            else if (f.isNil || s.isNil)
                return Family.Nil;
            else
                return Family.Cat(f, s);
        },
        // ¬¬P → P
        Not: ({ parser }) => {
            const p = parser.simplify;
            if (p.isNot)
                return p.parser.simplify;
            return Family.Not(p);
        },
        // Ɛ* → Ɛ
        // ∅* → Ɛ
        // L** → L*
        Star: ({ parser }) => {
            const p = parser.simplify;
            if (p.isEmpty || p.isNil)
                return Family.Empty;
            if (p.isStar)
                return p;
            return Family.Star(p);
        }
    }))
    // Returns a string representation of the expression
    .fold('print', { out: String }, {
        Alt: ({ left, right }) => {
            const leftString = left.isAtomic ? left.print : `(${left.print})`,
                rightString = right.isAtomic ? right.print : `(${right.print})`;
            return `${leftString}|${rightString}`;
        },
        Any: () => '.',
        Cat: ({ first, second }) => {
            const firstString = first.isAtomic ? first.print : `(${first.print})`,
                secondString = second.isAtomic ? second.print : `(${second.print})`;
            return `${firstString}${secondString}`;
        },
        Char: ({ value }) => `'${value}'`,
        Empty: () => 'ε',
        Nil: () => '∅',
        Not: ({ parser }) => {
            const parserString = parser.isAtomic ? parser.print : `(${parser.print})`;
            return `¬${parserString}`;
        },
        Star: ({ parser }) => {
            const parserString = parser.isAtomic ? parser.print : `(${parser.print})`;
            return `${parserString}*`;
        }
    })
    // Returns the concatenation of the current parser with another parser
    .fold('then', (Family) => ({ in: Family, out: Family }), {
        _: (self, other) => Family.Cat(self, other)
    })