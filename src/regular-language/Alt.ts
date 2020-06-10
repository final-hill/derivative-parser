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
 * Represents the union of two languages
 * L1 ∪ L2 = {foo} ∪ {bar} = {foo, bar}
 */
class Alt extends RegularLanguage {
    constructor(
        readonly left: RegularLanguage,
        readonly right: RegularLanguage
    ) { super(); }


    @override
    toString(): string {
        const leftString = this.left.isAtomic() ? `${this.left}` : `(${this.left})`,
            rightString = this.right.isAtomic() ? `${this.right}` : `(${this.right})`;

        return `${leftString}|${rightString}`;
    }
}

export default Alt;