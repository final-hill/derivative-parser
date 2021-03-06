/*!
 * @license
 * Copyright (C) 2021 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import {Parser} from './';
import {invariant, override, Contract, Contracted} from '@final-hill/decorator-contracts';
import { IParser } from './Parser';

/**
 * @inheritdoc
 * [a-b]
 */
interface IRange extends IParser {
    readonly from: string;
    readonly to: string;
}

const rangeContract = new Contract<IRange> ({
    [invariant](self){
        return self.from <= self.to &&
               self.from.length == 1 &&
               self.to.length == 1;
    }
});

@Contracted(rangeContract)
class Range extends Parser implements IRange {
    constructor(readonly from: string, readonly to: string) { super(); }

    @override
    deriv(c: string): Parser {
        const d = this.from == this.to ? this.char(this.from) :
                  this.from <= c && c <= this.to ? this.char(c) :
                  this.nil();

        return d.deriv(c);
    }

    @override isRange(): this is Range { return true; }
    @override nilOrEmpty(): Parser { return this.nil(); }
    @override toString(): string { return `[${this.from}-${this.to}]`; }
}

export default Range;
export {IRange};