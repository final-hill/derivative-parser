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
 * Represents the Kleene star of the given language
 * L*
 */
export default class Star extends Parser {
    constructor(readonly parser: Parser) { super(); }

    @override
    get height(): number { return 1 + this.parser.height; }

    @override
    containsEmpty(): boolean { return true; }

    // Dc(L*) = Dc(L) ◦ L*
    @override
    deriv(c: string): Parser {
        return this.parser.deriv(c).then(this);
    }

    @override
    equals(other: Parser): boolean {
        return other.isStar() && this.parser.equals(other.parser);
    }

    @override
    isStar(): this is Star { return true; }

    /**
     * δ(L*) = ε
     * @override
     */
    @override
    nilOrEmpty(): Parser { return this.empty(); }

    // L** → L*
    // ∅* → Ɛ
    // Ɛ* → Ɛ
    @override
    simplify(): Parser {
        const p = this.parser;
        if (p.isStar()) { return p; }
        if (p.isNil()) { return this.empty(); }
        // FIXME: cast required due to TypeScript 3.4.5 inference bug?
        if ((p as Parser).isEmpty()) { return this.empty(); }

        return this;
    }

    @override
    toString(): string {
        return this.parser.isAtomic() ? `${this.parser}*` : `(${this.parser})*`;
    }
}