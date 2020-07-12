/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import l from '.';

describe('Any', () => {
    test('Any.deriv(c)', () => {
        const pattern = l.Any();

        expect(pattern.deriv('a')).toEqual(l.EMPTY);
        expect(pattern.deriv('c')).toEqual(l.EMPTY);
        expect(pattern.deriv(' ')).toEqual(l.EMPTY);
    });

    test('Any.matches(c)', () => {
        const pattern = l.Any();

        expect(pattern.matches('a')).toBe(true);
        expect(pattern.matches('c')).toBe(true);
        expect(pattern.matches(' ')).toBe(true);
        expect(pattern.matches('ab')).toBe(false);
        expect(pattern.matches('')).toBe(false);
    });

    test('Any.toString()', () => {
        const pattern = l.Any();

        expect(pattern.toString()).toBe('.');
    });
});