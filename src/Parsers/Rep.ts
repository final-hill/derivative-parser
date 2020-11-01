/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import Contracts from '@final-hill/decorator-contracts';
import { Parser } from "./";

const contracts = new Contracts(true),
     {override} = contracts,
     assert: Contracts['assert'] = contracts.assert;

/**
 * The Repetition parser.
 * Matches the provided parser n times
 * P{n}
 */
class Rep extends Parser {
    constructor(
        readonly parser: Parser,
        readonly n: number,
    ) {
        super();
        assert(Number.isInteger(n) && n >= 0);
    }

    @override
    get height(): number {
        return 1 + this.parser.height;
    }

    @override
    containsEmpty(): boolean {
        return this.n === 0 || this.parser.containsEmpty();
    }

    // Dc(P{0}) = ε
    // Dc(P{1}) = Dc(P)
    // Dc(P{n}) = Dc(P)◦P{n-1}
    @override
    deriv(c: string): Parser {
        return this.n == 0 ? this.empty() :
               this.n == 1 ? this.parser.deriv(c) :
               this.parser.deriv(c).then(this.parser.rep(this.n-1));
    }

    @override
    equals(other: Parser): boolean {
        return other.isRep() &&
               other.n === this.n &&
               other.parser.equals(this.parser);
    }

    @override
    isRep(): this is Rep { return true; }

    @override
    nilOrEmpty(): Parser {
        return this.n === 0 ? this.empty() : this.parser.nilOrEmpty();
    }

    @override
    toString(): string {
        return `${this.parser}{${this.n}}`;
    }
}

export default Rep;