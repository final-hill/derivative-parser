/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import l from '.';
import { MSG_CHAR_EXPECTED } from '../Messages';

describe('Char', () => {
    test('Char.toString()', () => {
        expect(l.Char('a').toString()).toBe('\'a\'');
        expect(() => l.Char('abc')).toThrow(MSG_CHAR_EXPECTED);
    });

    test('Char.deriv(c)', () => {
        expect(l.Char('a').deriv('a')).toEqual(l.Empty());
        expect(l.Char('a').deriv('b')).toEqual(l.Nil());
    });

    test('Char.matches(c)', () => {
        const lang = l.Char('a');
        expect(lang.matches('a')).toBe(true);
        expect(lang.matches('b')).toBe(false);
    });
});