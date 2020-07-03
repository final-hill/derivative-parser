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
    assert: Contracts['assert'] = contracts.assert;

/**
 * Represents the Nil Language ∅. A language with no strings.
 * ∅ = {}
 */
export default class Nil extends RegularLanguage {
    constructor() { super(0); }

    // Dc(∅) = ∅
    @override
    deriv(c: string): RegularLanguage {
        assert(typeof c == 'string' && c.length == 1, MSG_CHAR_EXPECTED);

        return re.Nil();
    }

    @override
    equals(other: RegularLanguage): boolean { return other.isNil(); }

    @override
    isAtomic(): boolean { return true; }

    @override
    isNil(): this is Nil { return true; }

    // δ(∅) = ∅
    @override
    nilOrEmpty(): RegularLanguage { return re.Nil(); }

    @override
    toString(): string { return '∅'; }
}