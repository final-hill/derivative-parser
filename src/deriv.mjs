import { Trait, apply, memoFix } from "@mlhaufe/brevity/dist/index.mjs";
import { Parser } from "./index.mjs";

const { Alt, Char, Empty, Nil, Not, Nullability, EmptyReduction, Reduction, Rep, Seq, Star, Token } = Parser;

const _deriv = Trait({
    // Dc(P1 ∪ P2) = Dc(P1) ∪ Dc(P2)
    Alt({ left, right }, c) {
        return Alt(() => this[apply](left, c), () => this[apply](right, c))
    },
    // Dc(.) = ε
    Any() { return Empty },
    // Dc(c) = ε ↓ {c}
    // Dc(c') = ∅
    Char(self, c) {
        return self.value === c ? EmptyReduction(new Set([c])) : Nil
    },
    // Dc(ε) = ∅
    Empty() { return Nil },
    // Dc(∅) = ∅
    Nil() { return Nil },
    // Dc(¬P) = ¬Dc(P)
    Not(self, c) {
        return Not(() => this[apply](self.parser, c))
    },
    // Dc(δ(P)) = ∅
    Nullability() { return Nil },
    // Dc([a-z]) = Dc(c)
    // Dc([a-b]) = Dc(∅)
    Range({ from, to }, c) {
        return this[apply](
            from <= c && c <= to ? Char(c) : Nil,
            c
        )
    },
    // Dc(ε ↓ S) = ∅
    EmptyReduction() { return Nil },
    // Dc(p → f) = Dc(p) → f
    Reduction({ parser, fn }, c) {
        return Reduction(this[apply](parser, c), () => fn)
    },
    // Dc(P{0}) = ε
    // Dc(P{1}) = Dc(P)
    // Dc(P{n}) = Dc(P)◦P{n-1}
    Rep({ parser, n }, c) {
        if (n < 0) throw new Error('n must be greater than or equal to 0')
        if (!Number.isInteger(n)) throw new Error('n must be an integer')
        if (n === 0) {
            return Empty
        } else {
            if (n === 1)
                return this[apply](parser, c)
            return Seq(() => this[apply](parser, c), Rep(parser, n - 1))
        }
    },
    // Dc(P◦Q) = Dc(P)◦Q ∪ δ(P)◦Dc(Q)
    Seq({ first, second }, c) {
        return Alt(
            Seq(() => this[apply](first, c), second),
            Seq(Nullability(first), () => this[apply](second, c))
        )
    },
    // Dc(P*) = Dc(P)◦P* → λ(h, t).h ++ t
    Star({ parser }, c) {
        return Reduction(
            Seq(() => this[apply](parser, c), Star(parser)),
            () => (h, t) => [].concat(h, t)
            // [h, ...t]
        )
    },
    // Dc("") = Dc(ε)
    // Dc("c") = Dc(c)
    // Dc("abc") = Dc("a")◦"bc"
    Token({ value }, c) {
        return value.length == 0 ? this[apply](Empty, c) :
            value.length == 1 ? this[apply](Char(value), c) :
                Seq(
                    this[apply](Char(value[0]), c),
                    Token(value.substring(1))
                )
    }
})

/**
 * Computes the derivative of a parser with respect to a character c.
 * The derivative is a new parser where all strings that start with the character
 * are retained. The prefix character is then removed.
 * @see https://en.wikipedia.org/wiki/Brzozowski_derivative
 * @see https://matt.might.net/articles/parsing-with-derivatives/
 * @param {Parser} parser - The parser to derive.
 * @param {string} c - The character to derive with respect to.
 * @returns {Parser} The derivative of the parser with respect to the character.
 */
export const deriv = memoFix(_deriv, Nil);