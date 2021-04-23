/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { MSG_CHAR_EXPECTED } from '../Messages';
import {Parser} from './';

describe('Char', () => {
    const p = new Parser();

    test('Char.toString()', () => {
        expect(p.char('a').toString()).toBe('\'a\'');
        expect(() => p.char('abc')).toThrow(MSG_CHAR_EXPECTED);
    });

    test('Char.deriv(c)', () => {
        expect(p.char('a').deriv('a')).toEqual(p.empty());
        expect(p.char('a').deriv('b')).toEqual(p.nil());
    });

    test('Char.matches(c)', () => {
        const lang = p.char('a');
        expect(lang.matches('a')).toBe(true);
        expect(lang.matches('b')).toBe(false);
    });
});