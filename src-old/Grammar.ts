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
 * The base class for all grammars. A grammar is a parser that can be used to
 * parse text. A grammar is defined by a set of rules. The starting rule is
 * defined by the TOP() method.
 * @example
 * class MyGrammar extends Grammar {
 *    TOP() { return this.rule1(); }
 *    rule1() { return this.rule2().or(this.rule3()); }
 *    rule2() { return this.rule4().or(this.rule5()); }
 *    rule3() { return this.rule6().or(this.rule7()); }
 *  }
 */
export default abstract class Grammar extends Parser {
    constructor() {
        super();

        return new Proxy(this, handler);
    }

    /**
     * The starting rule for the grammar.
     */
    abstract TOP(): Parser;

    /**
     * Determines if the provided text can be recognized by the grammar
     *
     * @override
     * @param {string} text - The text to test
     * @returns {boolean} - The result of the test
     */
    [matches](text: string): boolean {
        return this.TOP()[matches](text);
    }
}

export { Grammar, matches };