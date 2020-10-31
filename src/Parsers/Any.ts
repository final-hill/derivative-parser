/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import {Parser} from './';
import Contracts from '@final-hill/decorator-contracts';

const contracts = new Contracts(true),
    {override} = contracts;

/**
 * Represents any single character. A wildcard.
 * '.'
 */
class Any extends Parser {
    @override
    get height(): number {
        return 0;
    }

    // D(.) = ε
    @override
    // @ts-ignore: unused variable
    deriv(c: string): Parser {
        return this.empty();
    }

    @override
    equals(other: Parser): boolean {
        return other.isAny();
    }

    @override
    isAny(): this is Any { return true; }

    @override
    isAtomic(): boolean { return true; }

    /**
     * δ(.) = ∅
     * @override
     */
    @override
    nilOrEmpty(): Parser { return this.nil(); }

    @override
    toString(): string { return '.'; }
}

export default Any;