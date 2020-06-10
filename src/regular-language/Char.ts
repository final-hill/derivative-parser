/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import RegularLanguage from './RegularLanguage';
import Contracts from '@final-hill/decorator-contracts';

const contracts = new Contracts(true),
    {override} = contracts,
    assert: Contracts['assert'] = contracts.assert,
    MSG_CHAR_EXPECTED = 'Invalid value. A single letter string is expected.';

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

    @override
    isAtomic(): boolean { return true; }

    @override
    toString(): string { return `'${this.value}'`; }
}

export default Char;
export {MSG_CHAR_EXPECTED};