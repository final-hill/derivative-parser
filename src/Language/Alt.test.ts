/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import l from '.';

describe('Alt', () => {
    test('Alt.deriv(c)', () => {
        expect(
            l.Alt(
                l.Char('a'),
                l.Char('b')
            ).deriv('a')
        ).toEqual(l.Alt(
            l.Char('a').deriv('a'),
            l.Char('b').deriv('a')
        ));
    });

    test('Alt.matches(c)', () => {
        const lang = l.Alt(l.Char('a'), l.Char('b'));
        expect(lang.matches('')).toBe(false);
        expect(lang.matches('a')).toBe(true);
        expect(lang.matches('b')).toBe(true);
        expect(lang.matches('c')).toBe(false);
    });

    test('Alt.toString()', () => {
        expect(l.Alt(l.Empty(),l.Nil()).toString()).toBe('ε|∅');
        expect(l.Alt(
            l.Empty(),
            l.Alt(
                l.Nil(),
                l.Empty()
            )
        ).toString()).toBe('ε|(∅|ε)');
        expect(l.Alt(
            l.Alt(
                l.Nil(),
                l.Empty()
            ),
            l.Empty()
        ).toString()).toBe('(∅|ε)|ε');
    });
});