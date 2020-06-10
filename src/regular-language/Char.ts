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
    assert: Contracts['assert'] = contracts.assert;

/**
 * Represents the language of a single character
 * c = {...,'a','b',...}
 * @throws Throws an error if the provided string is not length == 1
 */
class Char extends RegularLanguage {
    constructor(readonly value: string){
        super();
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
    nilOrEmpty(): RegularLanguage { return re.Nil(); }

    @override
    isAtomic(): boolean { return true; }

    @override
    toString(): string { return `'${this.value}'`; }
}

export default Char;
export {MSG_CHAR_EXPECTED};