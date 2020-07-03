/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import re from '.';

describe('Alt', () => {
    test('Alt.deriv(c)', () => {
        expect(
            re.Alt(
                re.Char('a'),
                re.Char('b')
            ).deriv('a')
        ).toEqual(re.Alt(
            re.Char('a').deriv('a'),
            re.Char('b').deriv('a')
        ));
    });

    test('Alt.matches(c)', () => {
        const l = re.Alt(re.Char('a'), re.Char('b'));
        expect(l.matches('')).toBe(false);
        expect(l.matches('a')).toBe(true);
        expect(l.matches('b')).toBe(true);
        expect(l.matches('c')).toBe(false);
    });

    test('Alt.toString()', () => {
        expect(re.Alt(re.Empty(),re.Nil()).toString()).toBe('ε|∅');
        expect(re.Alt(
            re.Empty(),
            re.Alt(
                re.Nil(),
                re.Empty()
            )
        ).toString()).toBe('ε|(∅|ε)');
        expect(re.Alt(
            re.Alt(
                re.Nil(),
                re.Empty()
            ),
            re.Empty()
        ).toString()).toBe('(∅|ε)|ε');
    });
});