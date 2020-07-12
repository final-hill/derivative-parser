/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import l from '.';

describe('OneOf', () => {
    test('OneOf.deriv(c)', () => {
        const l1 = l.OneOf('a','b','c'),
              l2 = l.OneOf(l.Char('a'), l.Char('b'), l.Char('c'));

        expect(l1.deriv('a').toString()).toEqual("'b' | 'c'");
        expect(l2.deriv('a').toString()).toEqual("'b' | 'c'");

        expect(l2.deriv('b').toString()).toEqual("'a' | 'c'");

        expect(() => l1.deriv('')).toThrow();
        expect(() => l2.deriv('')).toThrow();
    });

    test('OneOf.matches(c)', () => {
        const lang = l.OneOf('a','b','c');

        expect(lang.matches('a')).toBe(true);
        expect(lang.matches('b')).toBe(true);
        expect(lang.matches('c')).toBe(true);
        expect(lang.matches('d')).toBe(false);
        expect(lang.matches('')).toBe(false);
    });

    test('OneOf.toString()', () => {
        expect(l.OneOf('a','b','c').toString()).toBe("''a' | 'b' | 'c'");
        expect(l.ALPHA_NUM.toString()).toBe('a-z | A-Z | 0-9');
    });
});