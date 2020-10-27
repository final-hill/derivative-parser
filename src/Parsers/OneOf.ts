/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */
import {Parser} from './';
import Contracts from '@final-hill/decorator-contracts';

const contracts = new Contracts(true),
    {override} = contracts,
    assert: typeof contracts.assert = contracts.assert;

// TODO: combine with Alt?
/**
 * The choice parser.
 * L1 | L2 | ... | Ln
 */
export default class OneOf extends Parser {
    readonly languages: Parser[];

    constructor(...languages: Parser[]) {
        super();
        assert(languages.length > 0, 'Languages can not be empty');
        this.languages = languages.slice();
    }

    @override
    get height(): number {
        return 1 + Math.max(...this.languages.map(lang => lang.height));
    }

    @override
    containsEmpty(): boolean { return this.languages.some(lang => lang.containsEmpty()); }

    @override
    deriv(c: string): Parser {
        const lifted = this.languages.length == 1 ? this.languages[0] :
            this.languages[0].or(this.oneOf(...this.languages.slice(1)));

        return lifted.deriv(c).simplify();
    }

    @override
    isOneOf(): this is OneOf { return true; }

    // TODO: test. Should this be reduced to Alt?
    @override
    nilOrEmpty(): Parser { return this.oneOf(...this.languages.map(lang => lang.nilOrEmpty())); }

    @override
    toString(): string {
        return `(${
            this.languages.map(
                l => l.isAtomic() || l.isRange() ? l.toString() : `(${l.toString()})`
            ).join('|')
        })`;
    }
}