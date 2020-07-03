/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import re from '.';

describe('Nil', () => {
    test('Nil.deriv(c)', () => {
        expect(re.Nil().deriv('a')).toEqual(re.Nil());
    });
    test('Nil.matches(c)', () => {
        const l = re.Nil();
        expect(l.matches('')).toBe(false);
        expect(l.matches('a')).toBe(false);
    });
    test('Nil.toString()', () => {
        expect(re.Nil().toString()).toBe('∅');
    });
});