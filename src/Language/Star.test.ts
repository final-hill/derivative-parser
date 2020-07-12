/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import l from '.';

describe('Star', () => {
    test('Star.deriv(c)', () => {
        const L = l.Char('a');
        expect(
            l.Star(L).deriv('a')
        ).toEqual(
            l.Cat(L.deriv('a'),l.Star(L))
        );
    });

    test('Star.matches(c)', () => {
        const lang = l.Star(l.Char('a'));
        expect(lang.matches('')).toBe(true);
        expect(lang.matches('a')).toBe(true);
        expect(lang.matches('aaa')).toBe(true);
        expect(lang.matches('b')).toBe(false);
    });

    test('Star.toString()', () => {
        expect(l.Star(l.Char('c')).toString()).toBe('\'c\'*');

        expect(l.Star(
            l.Alt(l.Nil(),l.Empty())
        ).toString()).toBe('(∅|ε)*');
    });
});