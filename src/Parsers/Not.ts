/*!
 * @license
 * Copyright (C) 2022 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import {
    containsEmpty, deriv, equals, height, Empty, Nil, isAtomic, isNil, isNot,
    nilOrEmpty, Parser, simplify, toString
} from './';
import { override } from '@final-hill/decorator-contracts';

/**
 * The complement parser.
 * Matches anything that is not the provided parser
 */
export default class Not extends Parser {
    #parser: Parser;

    constructor(parser: Parser) {
        super();
        this.#parser = parser;
    }

    @override get [height](): number { return 1 + this.parser[height]; }

    get parser(): Parser { return this.#parser; }

    @override [containsEmpty](): boolean { return !this.parser[containsEmpty](); }
    /**
     * @override
     * @inheritdoc
     * Dc(¬P) = ¬Dc(P)
     */
    @override [deriv](c: string): Parser { return this.parser[deriv](c).not(); }
    @override [equals](other: Parser): boolean {
        return other[isNot]() && this.parser[equals]((other as Not).parser);
    }
    @override [isNot](): boolean { return true; }
    /**
     * @override
     * @inheritdoc
     * δ(¬P) = ε if δ(P) = ∅
     * δ(¬P) = ∅ if δ(P) = ε
     */
    @override [nilOrEmpty](): Nil | Empty {
        const ne = this.parser[nilOrEmpty]();

        return ne[isNil]() ? this.empty() : this.nil();
    }
    /**
     * @override
     * @inheritdoc
     * ¬¬P → P
     */
    @override [simplify](): Parser {
        const lang = this.parser[simplify]();

        return lang[isNot]() ? (lang as Not).parser : lang.not();
    }
    @override [toString](): string {
        return `¬${this.parser[isAtomic]() ? this.parser[toString]() : `(${this.parser[toString]()})`}`;
    }
}

export { Not };