import { Trait, all, apply, memoFix } from "@mlhaufe/brevity/dist/index.mjs";

const _emptySet = new Set(),
    _emptyEmptySet = new Set([[]])

const _parseEmpty = Trait({
    [all]() { return _emptySet },
    // ⌊P ∪ Q⌋(ε) = ⌊P⌋(ε) ∪ ⌊Q⌋(ε)
    Alt({ left, right }) {
        return new Set([...this[apply](left), ...this[apply](right)])
    },
    // ⌊δ(P)⌋(ε) = ⌊P⌋(ε)
    Nullability({ parser }) { return this[apply](parser) },
    // ⌊ε ↓ S⌋(ε) = S
    EmptyReduction({ trees }) { return trees },
    // ⌊p → f⌋(ε) = {f(t1), ..., fn(tn)} where {t1, ..., tn} = ⌊p⌋(ε)
    Reduction({ parser, fn }) {
        return new Set([...this[apply](parser)].reduce(fn, []))
    },
    // ⌊P ◦ Q⌋(ε) = ⌊P⌋(ε) x ⌊Q⌋(ε)
    Seq({ first, second }) {
        const result = new Set()
        for (const t1 of this[apply](first))
            for (const t2 of this[apply](second))
                result.add([t1, t2])
        return result
    },
    // ⌊P*⌋(ε) = {<>}
    Star() { return _emptyEmptySet },
})

/**
 * Produces a parse forest for the empty parses of its argument.
 * @param {Parser} parser
 * @returns {Set}
 */
export const parseEmpty = memoFix(_parseEmpty, new Set())