/*!
 * @license
 * Copyright (C) 2022 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { Parser } from '..';

export const parser = Symbol('parser');

/**
 * @inheritdoc
 */
export class ForwardingParser extends Parser {
    private _args: any;
    private _fn!: (...args: any[]) => Parser;
    private _innerParser?: Parser;
    private _target!: Record<PropertyKey, unknown>;

    constructor(
        target: Record<PropertyKey, unknown>,
        fn: (...args: any[]) => Parser,
        ...args: any[]
    ) {
        super();
        this._args = args;
        this._fn = fn;
        this._target = target;

        return new Proxy(this, {
            get: (target, propertyKey, receiver) =>
                propertyKey == parser || propertyKey == 'constructor' ? Reflect.get(target, propertyKey, receiver) :
                    Reflect.get(this[parser](), propertyKey, this[parser]())
        });
    }

    [parser](): Parser {
        return this._innerParser ?? (this._innerParser = this._fn.apply(this._target, this._args));
    }
}