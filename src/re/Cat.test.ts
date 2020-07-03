/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import re from '.';

describe('Cat', () => {
    test('Cat.deriv(c)', () => {
        const l1 = re.Alt(re.Char('a'), re.Empty()),
              l2 = re.Char('b');
        expect(
            re.Cat(l1, l2).deriv('a')
        ).toEqual(re.Alt(
            re.Cat(l1.deriv('a'),l2),
            re.Cat(l1.nilOrEmpty(), l2.deriv('a'))
        ));
    });

    test('Cat.matches(c)', () => {
        const l = re.Cat(re.Char('a'), re.Char('b'));
        expect(l.matches('')).toBe(false);
        expect(l.matches('a')).toBe(false);
        expect(l.matches('b')).toBe(false);
        expect(l.matches('ab')).toBe(true);
        expect(l.matches('ba')).toBe(false);
    });

    test('Cat.toString()', () => {
        expect(re.Cat(re.Empty(),re.Nil()).toString()).toBe('ε∅');
        expect(re.Cat(
            re.Empty(),
            re.Cat(
                re.Nil(),
                re.Empty()
            )
        ).toString()).toBe('ε(∅ε)');
        expect(re.Cat(
            re.Cat(
                re.Nil(),
                re.Empty()
            ),
            re.Empty()
        ).toString()).toBe('(∅ε)ε');
    });
});