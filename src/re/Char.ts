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
 * Represents the language of a single character
 * c = {...,'a','b',...}
 * @throws Throws an error if the provided string is not length == 1
 */
export default class Char extends RegularLanguage {
    constructor(readonly value: string){
        super(0);
        assert(typeof value == 'string' && value.length == 1, MSG_CHAR_EXPECTED);
    }

    // Dc(c) = ε
    // Dc(c') = ∅
    @override
    deriv(c: string): RegularLanguage {
        assert(typeof c == 'string' && c.length == 1, MSG_CHAR_EXPECTED);

        return c === this.value ? re.Empty() : re.Nil();
    }

    @override
    equals(other: RegularLanguage): boolean {
        return other.isChar() && this.value === other.value;
    }

    @override
    isAtomic(): boolean { return true; }

    @override
    isChar(): this is Char { return true; }

    /**
     * δ(c) = ∅
     * @override
     */
    @override
    nilOrEmpty(): RegularLanguage { return re.Nil(); }

    @override
    toString(): string { return `'${this.value}'`; }
}