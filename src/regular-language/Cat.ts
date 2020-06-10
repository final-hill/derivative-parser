/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import RegularLanguage from './RegularLanguage';
import Contracts from '@final-hill/decorator-contracts';

const {override} = new Contracts(true);

/**
 * Represents the concatenation of two languages
 * L1 ◦ L2
 */
class Cat extends RegularLanguage {
    constructor(
        readonly first: RegularLanguage,
        readonly second: RegularLanguage
    ){ super(); }

    @override
    toString(): string {
        const fst = this.first.isAtomic() ? `${this.first}` : `(${this.first})`,
            snd = this.second.isAtomic() ? `${this.second}` : `(${this.second})`;

        return `${fst}${snd}`;
    }
}

export default Cat;