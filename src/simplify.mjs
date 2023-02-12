import { Trait, all, apply, memoFix } from "@mlhaufe/brevity/dist/index.mjs";
import { Parser, isAlt, isEmpty, isNil, isNot, isStar, height, equals } from "./index.mjs";

const { Alt, Char, Empty, Not, Rep, Seq, Star } = Parser;

const _simplify = Trait({
    [all](self) { return self; },
    // P ∪ P → P
    // M ∪ P → P ∪ M
    // ∅ ∪ P → P
    // P ∪ ∅ → P
    // (P ∪ M) ∪ N → P ∪ (M ∪ N)
    Alt({ left, right }) {
        let [l, r] = [left, right]
        if (isAlt(l))
            [l, r] = [l.left, Alt(l.right, r)];
        if (height(l) > height(r))
            [l, r] = [r, l];
        if (equals(l, r))
            return l;
        else if (isNil(l))
            return r;
        else if (isNil(r))
            return l;
        if (l === left && r === right)
            return arguments[0]
        return Alt(l, r);
    },
    // ¬¬P → P
    Not({ parser }) {
        const simplified = this[apply](parser);
        return isNot(simplified) ? simplified.parser :
            simplified === parser ? arguments[0] : Not(simplified);
    },
    // [a-a] → a
    // [a-b] → [a-b]
    Range({ from, to }) {
        return from === to ? Char(from) : arguments[0];
    },
    // P{0} → Ɛ
    // P{1} → P
    // P{∞} → P*
    // P{n} → P{n}
    Rep({ parser, n }) {
        const simplified = this[apply](parser);
        return n === 0 ? Empty :
            n === 1 ? simplified :
                n === Infinity ? Star(simplified) :
                    simplified === parser ? arguments[0] :
                        Rep(simplified, n);
    },
    // PƐ → ƐP → P
    // ∅P → P∅ → ∅
    // Unused: (PQ)R → P(QR)
    // Unused: P(Q ∪ R) → PQ ∪ PR  (Is this actually simpler? Maybe the other direction?)
    // Unused: (Q ∪ R)P → QP ∪ RP  (Is this actually simpler? Maybe the other direction?)
    Seq({ first, second }) {
        const [fst, snd] = [first, second]
        return isNil(fst) ? fst :
            isNil(snd) ? snd :
                isEmpty(fst) ? snd :
                    isEmpty(snd) ? fst :
                        fst === first && snd === second ? arguments[0] :
                            Seq(fst, snd);
    },
    // ∅* → Ɛ
    // P** → P*
    // Ɛ* → Ɛ
    Star({ parser }) {
        const simplified = this[apply](parser);
        return isNil(simplified) || isEmpty(simplified) ? Empty :
            isStar(simplified) ? simplified :
                simplified === parser ? arguments[0] :
                    Star(simplified);
    }
});

/**
 * Converts the current parser to simplest form possible
 * Where 'simplify' is defined as minimizing the height of the expression tree.
 * Additionally, this method will refactor the expression so that other
 * methods will be more likely to short-circuit.
 * @param {Parser} parser
 * @returns {Parser}
 */
export const simplify = memoFix(_simplify, (self) => self)