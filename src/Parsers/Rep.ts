/*!
 * @license
 * Copyright (C) 2021 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { Contract, Contracted, invariant, override} from '@final-hill/decorator-contracts';
import { IParser, Parser } from './';

/**
 * The Repetition parser.
 * Matches the provided parser n times
 * P{n}
 */
interface IRep extends IParser {
    readonly parser: IParser;
    readonly n: number;
    /**
     * @inheritdoc
     * Dc(P{0}) = ε
     * Dc(P{1}) = Dc(P)
     * Dc(P{n}) = Dc(P)◦P{n-1}
     */
    deriv(c: string): IParser;
}

const repContract = new Contract<IRep>({
    [invariant](self) {
        return Number.isInteger(self.n) && self.n >= 0;
    }
});

@Contracted(repContract)
class Rep extends Parser implements IRep {
    constructor(
        readonly parser: Parser,
        readonly n: number,
    ) { super(); }
    @override get height(): number { return 1 + this.parser.height; }
    @override containsEmpty(): boolean { return this.n === 0 || this.parser.containsEmpty(); }
    @override deriv(c: string): Parser {
        return this.n == 0 ? this.empty() :
               this.n == 1 ? this.parser.deriv(c) :
               this.parser.deriv(c).then(this.parser.rep(this.n-1));
    }
    @override equals(other: Parser): boolean {
        return other.isRep() &&
               other.n === this.n &&
               other.parser.equals(this.parser);
    }
    @override isRep(): this is Rep { return true; }
    @override nilOrEmpty(): Parser {
        return this.n === 0 ? this.empty() : this.parser.nilOrEmpty();
    }
    @override toString(): string { return `${this.parser}{${this.n}}`; }
}

export default Rep;
export {IRep};