/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import {Parser} from './';
import Contracts from '@final-hill/decorator-contracts';

const contracts = new Contracts(true),
    {override} = contracts;

/**
 * Represents the concatenation of two parsers
 * P1 ◦ P2
 */
export default class Cat extends Parser {
    constructor(
        readonly first: Parser,
        readonly second: Parser
    ){ super(); }

    @override
    get height(): number {
        return 1 + Math.max(this.first.height, this.second.height);
    }

    /**
     * δ(P1◦P2) = δ(P1)◦δ(P2)
     * @override
     */
    @override
    containsEmpty(): boolean {
        return this.first.containsEmpty() && this.second.containsEmpty();
    }

    // Dc(P1◦P2) = (Dc(P1)◦P2) ∪ (δ(P1)◦Dc(P2))
    @override
    deriv(c: string): Parser {
        const [f,s] = [this.first,this.second];

        return f.deriv(c).then(s).or(f.nilOrEmpty().then(s.deriv(c)));
    }

    @override
    equals(other: Parser): boolean {
        return other.isCat() && this.first.equals(other.first) && this.second.equals(other.second);
    }

    @override
    isCat(): this is Cat { return true; }

    @override
    nilOrEmpty(): Parser {
        return this.first.nilOrEmpty().then(this.second.nilOrEmpty());
    }

    // PƐ → ƐP → P
    // ∅P → P∅ → ∅
    // Unused: (PQ)R → P(QR)
    // Unused: P(Q ∪ R) → PQ ∪ PR  (Is this actually simpler? Maybe the other direction?)
    // Unused: (Q ∪ R)P → QP ∪ RP  (Is this actually simpler? Maybe the other direction?)
    @override
    simplify(): Parser {
        const fst = this.first.simplify(),
              snd = this.second.simplify();

        return fst.isEmpty() ? snd :
               snd.isEmpty() ? fst :
               // TODO: TypeScript inference bug <https://github.com/microsoft/TypeScript/issues/36887>
               (fst as Parser).isNil() ? fst :
               (snd as Parser).isNil() ? snd :
               this;
    }

    @override
    toString(): string {
        const fst = this.first.isAtomic() ? `${this.first}` : `(${this.first})`,
              snd = this.second.isAtomic() ? `${this.second}` : `(${this.second})`;

        return `${fst}${snd}`;
    }
}