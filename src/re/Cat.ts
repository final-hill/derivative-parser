/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import RegularLanguage from './RegularLanguage';
import Contracts from '@final-hill/decorator-contracts';
import {MSG_CHAR_EXPECTED} from '../Messages';
import re from '.';

const contracts = new Contracts(true),
    {override} = contracts,
    assert: typeof contracts.assert = contracts.assert;

/**
 * Represents the concatenation of two languages
 * L1 ◦ L2
 */
export default class Cat extends RegularLanguage {
    constructor(
        readonly first: RegularLanguage,
        readonly second: RegularLanguage
    ){ super(1 + Math.max(first.height, second.height)); }

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
    deriv(c: string): RegularLanguage {
        assert(typeof c == 'string' && c.length == 1, MSG_CHAR_EXPECTED);

        return re.Alt(
            re.Cat(this.first.deriv(c), this.second),
            re.Cat(this.first.nilOrEmpty(), this.second.deriv(c))
        );
    }

    @override
    equals(other: RegularLanguage): boolean {
        return other.isCat() && this.first.equals(other.first) && this.second.equals(other.second);
    }

    @override
    isCat(): this is Cat { return true; }

    @override
    nilOrEmpty(): RegularLanguage { return re.Cat(this.first.nilOrEmpty(), this.second.nilOrEmpty()); }

    // LƐ → ƐL → L
    // ∅L → L∅ → ∅
    // Unused: (LM)N → L(MN)
    // Unused: L(M ∪ N) → LM ∪ LN  (Is this actually simpler? Maybe the other direction?)
    // Unused: (M ∪ N)L → ML ∪ NL  (Is this actually simpler? Maybe the other direction?)
    @override
    simplify(): RegularLanguage {
        const fst = this.first.simplify(),
              snd = this.second.simplify();

        return fst.isEmpty() ? snd :
               snd.isEmpty() ? fst :
               // TODO: TypeScript inference bug
               (fst as RegularLanguage).isNil() ? fst :
               (snd as RegularLanguage).isNil() ? snd :
               this;
    }

    @override
    toString(): string {
        const fst = this.first.isAtomic() ? `${this.first}` : `(${this.first})`,
            snd = this.second.isAtomic() ? `${this.second}` : `(${this.second})`;

        return `${fst}${snd}`;
    }
}