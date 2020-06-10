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
 * Represents the Kleene star of the given language
 * L*
 */
class Star extends RegularLanguage {
    constructor(readonly language: RegularLanguage) { super(); }

    // Dc(L*) = Dc(L) ◦ L*
    @override
    deriv(c: string): RegularLanguage {
        assert(typeof c == 'string' && c.length == 1, MSG_CHAR_EXPECTED);

        return re.Cat(this.language.deriv(c), this);
    }

    @override
    nilOrEmpty(): RegularLanguage { return re.Empty(); }

    @override
    toString(): string {
        return this.language.isAtomic() ? `${this.language}*` : `(${this.language})*`;
    }
}

export default Star;