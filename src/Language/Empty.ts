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
    assert: Contracts['assert'] = contracts.assert;

/**
 * Represents the Empty language ε consisting of a single empty string
 * ε = {""}
 */
export default class Empty extends Language {
    constructor() { super(0); }

    @override
    containsEmpty(): boolean { return true; }

    // Dc(ε) = ∅
    @override
    deriv(c: string): Language {
        assert(typeof c == 'string' && c.length == 1, MSG_CHAR_EXPECTED);

        return l.Nil();
    }

    @override
    equals(other: Language): boolean {
        return other.isEmpty();
    }

    @override
    isAtomic(): boolean { return true; }

    @override
    isEmpty(): this is Empty { return true; }

    /**
     * δ(ε) = ε
     * @override
     */
    @override
    nilOrEmpty(): Language { return l.Empty(); }

    @override
    toString(): string { return 'ε'; }
}