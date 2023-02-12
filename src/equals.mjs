import { Trait, apply, memoFix } from "@mlhaufe/brevity/dist/index.mjs"
import {
    isAlt, isAny, isSeq, isChar, isEmpty, isNil, isNot, isNullability,
    isRange, isEmptyReduction, isReduction, isRep, isStar, isToken
} from './index.mjs'

// a function that determines if two Sets are equal
const setEquals = (a, b) => a.size === b.size && [...a].every((x) => b.has(x))

const _equals = Trait({
    Alt({ left, right }, other) {
        return isAlt(other) && this[apply](left, other.left) && this[apply](right, other.right)
    },
    Any(_, other) { return isAny(other); },
    Char({ value }, other) {
        return isChar(other) && value === other.value
    },
    Empty(_, other) { return isEmpty(other); },
    Nil(_, other) { return isNil(other); },
    Not({ parser }, other) {
        return isNot(other) && this[apply](parser, other.parser)
    },
    Nullability({ parser }, other) {
        return isNullability(other) && this[apply](parser, other.parser)
    },
    Range({ from, to }, other) {
        return isRange(other) && from === other.from && to === other.to
    },
    EmptyReduction({ trees }, other) {
        return isEmptyReduction(other) && setEquals(trees, other.trees)
    },
    Reduction({ parser, fn }, other) {
        return isReduction(other) && this[apply](parser, other.parser) && fn.toString() === other.fn.toString()
    },
    Rep({ parser, n }, other) {
        return isRep(other) && n === other.n && this[apply](parser, other.parser)
    },
    Seq({ first, second }, other) {
        return isSeq(other) && this[apply](first, other.first) && this[apply](second, other.second)
    },
    Star({ parser }, other) {
        return isStar(other) && this[apply](parser, other.parser)
    },
    Token({ value }, other) {
        return isToken(other) && value === other.value
    }
})

/**
 * Determines if two parsers are equal
 * P1 ∪ P2 = P2 ∪ P1   if P1 = P1 and P2 = P2
 * . = .
 * P1◦P2 = P1◦P2  if P1 = P1 and P2 = P2
 * c = c
 * ε = ε
 * ∅ = ∅
 * ¬P = ¬P  if P = P
 * [a,b] = [a,b]
 * P{n} = P{n}
 * P* = P*  if P = P
 * "c" = "c"
 */
export const equals = memoFix(_equals, true)