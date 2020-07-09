/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import RegularLanguage from './RegularLanguage';
import Contracts from '@final-hill/decorator-contracts';
import { MSG_CHAR_EXPECTED } from '../Messages';
import re from '.';

const contracts = new Contracts(true),
    {override} = contracts,
    assert: typeof contracts.assert = contracts.assert;

/**
 * Represents any single character. A wildcard.
 * '.'
 */
class Any extends RegularLanguage {
    constructor() {
        super(0);
    }

    // D(.) = ε
    @override
    deriv(c: string): RegularLanguage {
        assert(typeof c == 'string' && c.length == 1, MSG_CHAR_EXPECTED);

        return re.Empty();
    }

    @override
    equals(other: RegularLanguage): boolean {
        return other === this; // TODO: can this be improved?
    }

    @override
    isAny(): this is Any { return true; }

    @override
    isAtomic(): boolean { return true; }

    /**
     * δ(.) = ∅
     * @override
     */
    @override
    nilOrEmpty(): RegularLanguage { return re.Nil(); }

    @override
    toString(): string { return '.'; }
}

export default Any;