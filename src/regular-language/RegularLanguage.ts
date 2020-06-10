/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import Contracts from '@final-hill/decorator-contracts';

const {invariant, override} = new Contracts(true);

/**
 * A Regular Language is a Language that can be described non-recursively
 * by the following constructs:  ∅ | ε | c | L1 ∪ L2 | L1 ◦ L2 | L*
 *
 * @see https://en.wikipedia.org/wiki/Regular_language#Equivalent_formalisms
 */
@invariant
class RegularLanguage {
    /**
     * Returns a string representation of the expression
     */
    @override
    toString(): string { throw new TypeError('Not implemented'); }

    /**
     * Determine if the current expression is an instance of Char | Empty | Nil
     *
     * @returns {boolean} -
     */
    isAtomic(): boolean { return false; }
}

export default RegularLanguage;