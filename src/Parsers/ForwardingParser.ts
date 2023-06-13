/*!
 * @license
 * Copyright (C) 2021 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { IAlt, IAny, ICat, IChar, IEmpty, IParser, INil, INot, Parser,
    IRange, IRep, IStar, IToken, toString, simplify, nilOrEmpty, matches,
     isToken, isRange, isStar, isRep, isNot, isNil, isEmpty, isChar, isCat,
      isAtomic, isAny, isAlt, equals, deriv, containsEmpty, height } from '.';
import {override} from '@final-hill/decorator-contracts';

/**
 * @inheritdoc
 */
interface IForwardingParser extends IParser {
    readonly parser: IParser;
}

class ForwardingParser extends Parser implements IForwardingParser {
    protected target!: Record<PropertyKey, unknown>;
    protected fn!: (...args: any[]) => IParser;
    protected args: any;
    protected innerParser: IParser | undefined;

    constructor(
        target: Record<PropertyKey, unknown>,
        fn: (...args: any[]) => IParser,
        ...args: any[]
    ){
        super();
        Object.assign(this, {target, fn, args});

        /* TODO: generalize get
        return new Proxy(this, {
            get(target,propertyKey,receiver) {
                //TODO: forward to innerParser expect parser property
            }
        });
        */
    }
    get parser(): IParser {
        return this.innerParser ?? (this.innerParser = this.fn.apply(this.target,this.args));
    }
    @override get [height](): number { return this.parser[height]; }
    @override [containsEmpty](): boolean { return this.parser[containsEmpty](); }
    @override [deriv](c: string): IParser { return this.parser[deriv](c); }
    @override [equals](other: IParser): boolean { return this.parser[equals](other); }
    @override [isAlt](): this is IAlt { return this.parser[isAlt](); }
    @override [isAny](): this is IAny { return this.parser[isAny](); }
    @override [isAtomic](): boolean { return this.parser[isAtomic](); }
    @override [isCat](): this is ICat { return this.parser[isCat](); }
    @override [isChar](): this is IChar { return this.parser[isChar](); }
    @override [isEmpty](): this is IEmpty { return this.parser[isEmpty](); }
    @override [isNil](): this is INil { return this.parser[isNil](); }
    @override [isNot](): this is INot { return this.parser[isNot](); }
    @override [isRep](): this is IRep { return this.parser[isRep](); }
    @override [isStar](): this is IStar { return this.parser[isStar](); }
    @override [isRange](): this is IRange { return this.parser[isRange](); }
    @override [isToken](): this is IToken { return this.parser[isToken]();}
    @override [matches](text: string): boolean { return this.parser[matches](text); }
    @override [nilOrEmpty](): INil | IEmpty { return this.parser[nilOrEmpty](); }
    @override [simplify](): IParser { return this.parser[simplify](); }
    @override [toString](): string { return this.parser[toString](); }
}

export default ForwardingParser;
export {IForwardingParser};
