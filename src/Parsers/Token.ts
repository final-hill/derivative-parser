/*!
 * @license
 * Copyright (C) 2021 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import {Parser, IParser} from './';
import { Contract, Contracted, invariant, override} from '@final-hill/decorator-contracts';

/**
 * @inheritdoc
 * "Foo"
 */
interface IToken extends IParser {
    readonly value: string;
}

const tokenContract = new Contract<IToken>({
    [invariant](self) {
        return self.value.length > 0;
    }
});

@Contracted(tokenContract)
class Token extends Parser implements IToken {
    constructor(readonly value: string) { super(); }
    @override get height(): number { return 0; }
    @override containsEmpty(): boolean { return false; }
    @override deriv(c: string): IParser {
        const d = this.value.length == 1 ? this.char(this.value).deriv(c) :
            this.char(this.value[0]).deriv(c).then(this.token(this.value.substring(1)));

        return d;
    }
    @override isToken(): this is IToken { return true; }
    @override nilOrEmpty(): IParser { return this.nil(); }
    @override toString(): string { return JSON.stringify(this.value); }
}

export default Token;
export {IToken};