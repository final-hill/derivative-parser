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
 * Represents the union of two languages
 * L1 ∪ L2 = {foo} ∪ {bar} = {foo, bar}
 */
class Alt extends RegularLanguage {
    constructor(
        readonly left: RegularLanguage,
        readonly right: RegularLanguage
    ) { super(); }


    // Dc(L1 ∪ L2) = Dc(L1) ∪ Dc(L2)
    @override
    deriv(c: string): RegularLanguage {
        assert(typeof c == 'string' && c.length == 1, MSG_CHAR_EXPECTED);

        return re.Alt(this.left.deriv(c), this.right.deriv(c));
    }

    @override
    containsEmpty(): boolean {
        return this.left.containsEmpty() || this.right.containsEmpty();
    }

    @override
    nilOrEmpty(): RegularLanguage {
        return re.Alt(this.left.nilOrEmpty(), this.right.nilOrEmpty());
    }

    @override
    toString(): string {
        const leftString = this.left.isAtomic() ? `${this.left}` : `(${this.left})`,
            rightString = this.right.isAtomic() ? `${this.right}` : `(${this.right})`;

        return `${leftString}|${rightString}`;
    }
}

export default Alt;