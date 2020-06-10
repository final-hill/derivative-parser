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
 * Represents the Kleene star of the given language
 * L*
 */
class Star extends RegularLanguage {
    constructor(readonly language: RegularLanguage) { super(); }

    @override
    toString(): string {
        return this.language.isAtomic() ? `${this.language}*` : `(${this.language})*`;
    }
}

export default Star;