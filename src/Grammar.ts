/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import {Parser, ForwardingParser} from './Parsers';
import Contracts from '@final-hill/decorator-contracts';

const contracts = new Contracts(true),
    {override} = contracts;

/**
 * The Grammar class represents
 */
class Grammar extends Parser {
    protected _handler: ProxyHandler<Record<PropertyKey, unknown>> = {
        get(target, propertyKey, receiver) {
            const value = Reflect.get(target, propertyKey, receiver);
            // TODO: require naming convention to prevent conflict
            // with non-parser methods?
            if(typeof value == 'function' &&
               propertyKey !== 'toString' &&
               propertyKey !== 'matches'
            ) {
                return (...args: any[]) => new ForwardingParser(receiver,value,args);
            } else {
                return value;
            }
        }
    };

    constructor() {
        super();

        return new Proxy(this, this._handler as any);
    }

    /**
     * Determines if the provided text can be recognized by the grammar
     *
     * @override
     * @param {string} text - The text to test
     * @returns {boolean} - The result of the test
     * @throws - If text is not a string
     */
    @override
    matches(text: string): boolean {
        const ruleNames = Object.getOwnPropertyNames(Object.getPrototypeOf(this))
                        .filter(name => name != 'constructor' && typeof (this as any)[name] == 'function'),
            entryPoint: Parser = ruleNames.length == 0 ? this.nil() : (this as any)[ruleNames[0]].apply(this);

        return entryPoint.matches(text);
    }
}

export default Grammar;