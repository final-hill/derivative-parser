/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import Language from './Language';
import Contracts from '@final-hill/decorator-contracts';
import {MSG_CHAR_EXPECTED} from '../Messages';
import l from '.';

const contracts = new Contracts(true),
    {override} = contracts,
    assert: typeof contracts.assert = contracts.assert;

/**
 * Represents the concatenation of two languages
 * L1 ◦ L2
 */
export default class Cat extends Language {
    constructor(
        readonly first: Language,
        readonly second: Language
    ){ super(); }

    @override
    get height(): number {
        return 1 + Math.max(this.first.height, this.second.height);
    }

    /**
     * δ(L1 L2) = δ(L1) δ(L2)
     * @override
     */
    @override
    containsEmpty(): boolean {
        return this.first.containsEmpty() && this.second.containsEmpty();
    }

    // Dc(L1◦L2) = (Dc(L1)◦L2) ∪ (δ(L1)◦Dc(L2))
    @override
    deriv(c: string): Language {
        assert(typeof c == 'string' && c.length == 1, MSG_CHAR_EXPECTED);

        return l.Alt(
            l.Cat(this.first.deriv(c), this.second),
            l.Cat(this.first.nilOrEmpty(), this.second.deriv(c))
        ).simplify();
    }

    @override
    equals(other: Language): boolean {
        return other.isCat() && this.first.equals(other.first) && this.second.equals(other.second);
    }

    @override
    isCat(): this is Cat { return true; }

    @override
    nilOrEmpty(): Language { return l.Cat(this.first.nilOrEmpty(), this.second.nilOrEmpty()); }

    // LƐ → ƐL → L
    // ∅L → L∅ → ∅
    // Unused: (LM)N → L(MN)
    // Unused: L(M ∪ N) → LM ∪ LN  (Is this actually simpler? Maybe the other direction?)
    // Unused: (M ∪ N)L → ML ∪ NL  (Is this actually simpler? Maybe the other direction?)
    @override
    simplify(): Language {
        const fst = this.first.simplify(),
              snd = this.second.simplify();

        return fst.isEmpty() ? snd :
               snd.isEmpty() ? fst :
               // TODO: TypeScript inference bug
               (fst as Language).isNil() ? fst :
               (snd as Language).isNil() ? snd :
               this;
    }

    @override
    toString(): string {
        const fst = this.first.isAtomic() ? `${this.first}` : `(${this.first})`,
              snd = this.second.isAtomic() ? `${this.second}` : `(${this.second})`;

        return `${fst}${snd}`;
    }
}