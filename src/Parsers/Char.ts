/*!
 * @license
 * Copyright (C) 2021 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import {Parser} from './';
import {override, invariant, Contract, Contracted} from '@final-hill/decorator-contracts';
import { IParser } from './Parser';

/**
 * @inheritdoc
 * Represents the parser of a single character
 * c = {...,'a','b',...}
 * @throws Throws an error if the provided string is not length == 1
 * @example new Char('a')
 */
interface IChar extends IParser {
    /**
     * The character value of the parser. Has a length of 1
     */
    readonly value: string;

    /**
     * @inheritdoc
     * Dc(c) = ε
     * Dc(c') = ∅
     */
    deriv(c: string): IParser;

    /**
     * @inheritdoc
     * δ(c) = ∅
     */
    nilOrEmpty(): IParser;
}

const charContract = new Contract<IChar>({
    [invariant](self) { return self.value.length == 1; }
});

@Contracted(charContract)
class Char extends Parser implements IChar {
    constructor(readonly value: string) { super(); }
    @override get height(): number { return 0; }
    @override deriv(c: string): IParser { return c === this.value ? this.empty() : this.nil(); }
    @override equals(other: IParser): boolean { return other.isChar() && this.value === other.value; }
    @override isAtomic(): boolean { return true; }
    @override isChar(): this is IChar { return true; }
    @override nilOrEmpty(): Parser { return this.nil(); }
    @override toString(): string { return `'${this.value}'`; }
}

export default Char;
export {IChar};