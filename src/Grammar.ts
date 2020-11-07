/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import {Parser} from './Parsers';

const p = new Parser();

/**
 * The Grammar class represents
 */
class Grammar {
    /**
     * Determines if the provided text can be recognized by the grammar
     *
     * @override
     * @param {string} text - The text to test
     * @returns {boolean} - The result of the test
     * @throws - If text is not a string
     */
    matches(text: string): boolean {
        const ruleNames = Object.getOwnPropertyNames(Object.getPrototypeOf(this))
                        .filter(name => name != 'constructor' && typeof (this as any)[name] == 'function'),
            entryPoint: Parser = ruleNames.length == 0 ? p.nil() : (this as any)[ruleNames[0]].apply(this);

        return entryPoint.matches(text);
    }
}

export default Grammar;