/*!
 * @license
 * Copyright (C) 2022 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { containsEmpty, deriv, equals, height, isAtomic, isEmpty, nilOrEmpty, Parser, toString } from './';
import { override } from '@final-hill/decorator-contracts';

/**
 * @inheritdoc
 * Represents the Empty parser which matches the empty string
 * ε = {""}
 */
export default class Empty extends Parser {
    @override get [height](): number { return 0; }
    @override [containsEmpty](): boolean { return true; }
    /**
     * @override
     * @inheritdoc
     * Dc(ε) = ∅
     */
    // @ts-ignore: unused variable
    @override [deriv](c: string): Parser { return this.nil(); }
    @override [equals](other: Parser): boolean { return other[isEmpty](); }
    @override [isAtomic](): boolean { return true; }
    @override [isEmpty](): this is Empty { return true; }
    /**
     * @override
     * @inheritdoc
     * δ(ε) = ε
     */
    @override [nilOrEmpty](): Empty { return this; }
    @override [toString](): string { return 'ε'; }
}

export { Empty };