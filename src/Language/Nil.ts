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
 * Represents the Nil Language ∅. A language with no strings.
 * ∅ = {}
 */
export default class Nil extends Language {
    constructor() { super(0); }

    // Dc(∅) = ∅
    @override
    deriv(c: string): Language {
        assert(typeof c == 'string' && c.length == 1, MSG_CHAR_EXPECTED);

        return l.Nil();
    }

    @override
    equals(other: Language): boolean { return other.isNil(); }

    @override
    isAtomic(): boolean { return true; }

    @override
    isNil(): this is Nil { return true; }

    // δ(∅) = ∅
    @override
    nilOrEmpty(): Language { return l.Nil(); }

    @override
    toString(): string { return '∅'; }
}