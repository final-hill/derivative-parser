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
 * Represents the language of a single character
 * c = {...,'a','b',...}
 * @throws Throws an error if the provided string is not length == 1
 */
export default class Char extends Language {
    constructor(readonly value: string){
        super();
        assert(typeof value == 'string' && value.length == 1, MSG_CHAR_EXPECTED);
    }

    @override
    get height(): number {
        return 0;
    }

    // Dc(c) = ε
    // Dc(c') = ∅
    @override
    deriv(c: string): Language {
        assert(typeof c == 'string' && c.length == 1, MSG_CHAR_EXPECTED);

        return c === this.value ? l.Empty() : l.Nil();
    }

    @override
    equals(other: Language): boolean {
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
    nilOrEmpty(): Language { return l.Nil(); }

    @override
    toString(): string { return `'${this.value}'`; }
}