/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import RegularLanguage from './RegularLanguage';
import Contracts from '@final-hill/decorator-contracts';
import {MSG_CHAR_EXPECTED} from '../Messages';
import re from './';

const contracts = new Contracts(true),
    {override} = contracts,
    assert: typeof contracts.assert = contracts.assert;

/**
 * Represents the concatenation of two languages
 * L1 ◦ L2
 */
class Cat extends RegularLanguage {
    constructor(
        readonly first: RegularLanguage,
        readonly second: RegularLanguage
    ){ super(); }

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
    nilOrEmpty(): RegularLanguage { return re.Cat(this.first.nilOrEmpty(), this.second.nilOrEmpty()); }

    @override
    toString(): string {
        const fst = this.first.isAtomic() ? `${this.first}` : `(${this.first})`,
            snd = this.second.isAtomic() ? `${this.second}` : `(${this.second})`;

        return `${fst}${snd}`;
    }
}

export default Cat;