/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import RegularLanguage from './RegularLanguage';
import Contracts from '@final-hill/decorator-contracts';

const {override} = new Contracts(true);

/**
 * Represents the Nil Language ∅. A language with no strings.
 * ∅ = {}
 */
class Nil extends RegularLanguage {
    @override
    isAtomic(): boolean { return true; }

    @override
    toString(): string { return '∅'; }
}

export default Nil;