/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import re from '.';
import { MSG_CHAR_EXPECTED } from '../Messages';

describe('Char', () => {
    test('Char.toString()', () => {
        expect(re.Char('a').toString()).toBe('\'a\'');
        expect(() => re.Char('abc')).toThrow(MSG_CHAR_EXPECTED);
    });

    test('Char.deriv(c)', () => {
        expect(re.Char('a').deriv('a')).toEqual(re.Empty());
        expect(re.Char('a').deriv('b')).toEqual(re.Nil());
    });

    test('Char.matches(c)', () => {
        const l = re.Char('a');
        expect(l.matches('a')).toBe(true);
        expect(l.matches('b')).toBe(false);
    });
});