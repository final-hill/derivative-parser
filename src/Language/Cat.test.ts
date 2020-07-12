/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import l from '.';

describe('Cat', () => {
    test('Cat.deriv(c)', () => {
        const l1 = l.Alt(l.Char('a'), l.Empty()),
              l2 = l.Char('b');
        expect(
            l.Cat(l1, l2).deriv('a')
        ).toEqual(l.Alt(
            l.Cat(l1.deriv('a'),l2),
            l.Cat(l1.nilOrEmpty(), l2.deriv('a'))
        ));
    });

    test('Cat.matches(c)', () => {
        const lang = l.Cat(l.Char('a'), l.Char('b'));
        expect(lang.matches('')).toBe(false);
        expect(lang.matches('a')).toBe(false);
        expect(lang.matches('b')).toBe(false);
        expect(lang.matches('ab')).toBe(true);
        expect(lang.matches('ba')).toBe(false);
    });

    test('Cat.toString()', () => {
        expect(l.Cat(l.Empty(),l.Nil()).toString()).toBe('ε∅');
        expect(l.Cat(
            l.Empty(),
            l.Cat(
                l.Nil(),
                l.Empty()
            )
        ).toString()).toBe('ε(∅ε)');
        expect(l.Cat(
            l.Cat(
                l.Nil(),
                l.Empty()
            ),
            l.Empty()
        ).toString()).toBe('(∅ε)ε');
    });
});