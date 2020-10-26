/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import Language from './Language';
import Contracts from '@final-hill/decorator-contracts';
import { MSG_CHAR_EXPECTED } from '../Messages';
import l from '.';

const contracts = new Contracts(true),
    {override} = contracts,
    assert: typeof contracts.assert = contracts.assert;

/**
 * Represents any single character. A wildcard.
 * '.'
 */
class Any extends Language {
    @override
    get height(): number {
        return 0;
    }

    // D(.) = ε
    @override
    deriv(c: string): Language {
        assert(typeof c == 'string' && c.length == 1, MSG_CHAR_EXPECTED);

        return l.Empty();
    }

    @override
    equals(other: Language): boolean {
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
    nilOrEmpty(): Language { return l.Nil(); }

    @override
    toString(): string { return '.'; }
}

export default Any;