/*!
 * @license
 * Copyright (C) 2022 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { Contract, Contracted, extend, invariant, override } from '@final-hill/decorator-contracts';
import { containsEmpty, deriv, equals, height, isRep, nilOrEmpty, Parser, toString } from './';
import { parserContract } from './Parser';

const repContract = new Contract<Rep>({
    [extend]: parserContract,
    [invariant](self) {
        return Number.isInteger(self.n) && self.n >= 0;
    }
});

/**
 * The Repetition parser.
 * Matches the provided parser n times
 * P{n}
 */
@Contracted(repContract)
export default class Rep extends Parser {
    #parser: Parser;
    #n: number;

    constructor(parser: Parser, n: number,) {
        super();
        this.#n = n;
        this.#parser = parser;
    }

    @override get [height](): number { return 1 + this.parser[height]; }

    get parser(): Parser { return this.#parser; }
    get n(): number { return this.#n; }

    @override [containsEmpty](): boolean { return this.n === 0 || this.parser[containsEmpty](); }
    /**
     * @override
     * @inheritdoc
     * Dc(P{0}) = ε
     * Dc(P{1}) = Dc(P)
     * Dc(P{n}) = Dc(P)◦P{n-1}
     */
    @override [deriv](c: string): Parser {
        return this.n == 0 ? this.empty() :
            this.n == 1 ? this.parser[deriv](c) :
                this.parser[deriv](c).then(this.parser.rep(this.n - 1));
    }
    @override [equals](other: Parser): boolean {
        return other[isRep]() &&
            (other as Rep).n === this.n &&
            (other as Rep).parser[equals](this.parser);
    }
    @override [isRep](): this is Rep { return true; }
    @override [nilOrEmpty](): Parser {
        return this.n === 0 ? this.empty() : this.parser[nilOrEmpty]();
    }
    @override [toString](): string { return `${this.parser[toString]()}{${this.n}}`; }
}

export { Rep };