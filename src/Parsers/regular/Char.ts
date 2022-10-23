/*!
 * @license
 * Copyright (C) 2022 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { deriv, equals, height, isAtomic, isChar, nilOrEmpty, Parser, toString } from '..';

export const value = Symbol('value');

/**
 * @inheritdoc
 * Represents the parser of a single character
 * c = {...,'a','b',...}
 * @example new Char('a')
 */
export class Char extends Parser {
    #value;
    constructor(value: AsciiChar) {
        super();

        this.#value = value;
    }

    [height](): number { return 0; }

    /**
     * The character value of the parser
     * @returns {AsciiChar} The character value
     */
    [value](): AsciiChar { return this.#value; }

    /**
     * @override
     * @inheritdoc
     * Dc(c) = ε
     * Dc(c') = ∅
     */
    [deriv](c: AsciiChar): Parser { return c === this.#value ? this.empty() : this.nil(); }

    [equals](other: Parser): boolean {
        // TODO: cast needed due to TypeScript inference bug: <https://github.com/microsoft/TypeScript/issues/36887>
        return other[isChar]() && this.#value === (other as Char)[value]();
    }
    [isAtomic](): boolean { return true; }
    [isChar](): this is Char { return true; }

    /**
     * @override
     * @inheritdoc
     * δ(c) = ∅
     */
    [nilOrEmpty](): Parser { return this.nil(); }
    [toString](): string { return `'${this.#value}'`; }
}