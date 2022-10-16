/*!
 * @license
 * Copyright (C) 2022 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { AssertionError } from '@final-hill/decorator-contracts';
import { Char, deriv, height, matches, Parser, toString, value } from '../Parsers';

describe('Char', () => {
    const p = new Parser();

    test('Construct Char', () => {
        const c = p.char('a');

        expect(c).toBeInstanceOf(Char);
        expect(c[value]).toBe('a');
        expect(c[height]).toBe(0);
    });

    test('Char[toString]()', () => {
        expect(p.char('a')[toString]()).toBe('\'a\'');
        expect(() => {
            p.char('abc');
        }).toThrow(AssertionError);
    });

    test('Char[deriv](c)', () => {
        expect(p.char('a')[deriv]('a')).toEqual(p.empty());
        expect(p.char('a')[deriv]('b')).toEqual(p.nil());
    });

    test('Char[matches](c)', () => {
        const lang = p.char('a');
        expect(lang[matches]('a')).toBe(true);
        expect(lang[matches]('b')).toBe(false);
    });
});