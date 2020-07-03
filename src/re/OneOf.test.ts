/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import re from '.';

describe('OneOf', () => {
    test('OneOf.deriv(c)', () => {
        const l1 = re.OneOf('a','b','c'),
              l2 = re.OneOf(re.Char('a'), re.Char('b'), re.Char('c'));

        expect(l1.deriv('a').toString()).toEqual('\'b\' | \'c\'');
        expect(l2.deriv('a').toString()).toEqual('\'b\' | \'c\'');

        expect(l2.deriv('b').toString()).toEqual('\'a\' | \'c\'');

        expect(() => l1.deriv('')).toThrow();
        expect(() => l2.deriv('')).toThrow();
    });

    test('OneOf.matches(c)', () => {
        const l = re.OneOf('a','b','c');

        expect(l.matches('a')).toBe(true);
        expect(l.matches('b')).toBe(true);
        expect(l.matches('c')).toBe(true);
        expect(l.matches('d')).toBe(false);
        expect(l.matches('')).toBe(false);
    });

    test('OneOf.toString()', () => {
        expect(re.OneOf('a','b','c').toString()).toBe('\'a\' | \'b\' | \'c\'');
        expect(re.ALPHA_NUM.toString()).toBe('a-z | A-Z | 0-9');
    });
});