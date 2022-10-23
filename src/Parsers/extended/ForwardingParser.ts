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
    #args: any;
    #fn!: (...args: any[]) => Parser;
    #innerParser?: Parser;
    #target!: Record<PropertyKey, unknown>;

    constructor(
        target: Record<PropertyKey, unknown>,
        fn: (...args: any[]) => Parser,
        ...args: any[]
    ) {
        super();
        this.#args = args;
        this.#fn = fn;
        this.#target = target;

        // return new Proxy(this, {
        //     get: (target, propertyKey, receiver) =>
        //         propertyKey == parser || propertyKey == 'constructor' ? Reflect.get(target, propertyKey, receiver) :
        //             Reflect.get(this[parser](), propertyKey, this[parser]())
        // });
    }

    [parser](): Parser {
        return this.#innerParser ?? (this.#innerParser = this.#fn.apply(this.#target, this.#args));
    }
}