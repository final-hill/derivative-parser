/*!
 * @license
 * Copyright (C) 2022 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { Parser, ForwardingParser, matches } from './Parsers';

const handler: ProxyHandler<any> = {
    get(target, propertyKey, receiver) {
        const value = Reflect.get(target, propertyKey, receiver);

        return typeof propertyKey != 'symbol' && propertyKey != 'constructor' && typeof value == 'function' ?
            (...args: any[]) => new ForwardingParser(receiver, value, args)
            : value;
    }
};

/**
 * The Grammar class represents
 */
export default class Grammar extends Parser {
    constructor() {
        super();

        return new Proxy(this, handler);
    }

    /**
     * Determines if the provided text can be recognized by the grammar
     *
     * @override
     * @param {string} text - The text to test
     * @returns {boolean} - The result of the test
     * @throws - If text is not a string
     */
    [matches](text: string): boolean {
        const rules = Object.entries<() => Parser>(Object.getPrototypeOf(this)),
            entryPoint = rules.length == 0 ? this.nil() : rules[0][1].apply(this);

        return entryPoint[matches](text);
    }
}

export { Grammar, matches };