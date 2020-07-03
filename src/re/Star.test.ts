/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import re from '.';

describe('Star', () => {
    test('Star.deriv(c)', () => {
        const L = re.Char('a');
        expect(
            re.Star(L).deriv('a')
        ).toEqual(
            re.Cat(L.deriv('a'),re.Star(L))
        );
    });

    test('Star.matches(c)', () => {
        const l = re.Star(re.Char('a'));
        expect(l.matches('')).toBe(true);
        expect(l.matches('a')).toBe(true);
        expect(l.matches('aaa')).toBe(true);
        expect(l.matches('b')).toBe(false);
    });

    test('Star.toString()', () => {
        expect(re.Star(re.Char('c')).toString()).toBe('\'c\'*');

        expect(re.Star(
            re.Alt(re.Nil(),re.Empty())
        ).toString()).toBe('(∅|ε)*');
    });
});