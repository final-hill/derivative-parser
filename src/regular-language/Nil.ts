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
class Nil extends RegularLanguage {

    // Dc(∅) = ∅
    @override
    deriv(c: string): RegularLanguage {
        assert(typeof c == 'string' && c.length == 1, MSG_CHAR_EXPECTED);

        return re.Nil();
    }

    @override
    isAtomic(): boolean { return true; }

    @override
    nilOrEmpty(): RegularLanguage { return re.Nil(); }

    @override
    toString(): string { return '∅'; }
}

export default Nil;