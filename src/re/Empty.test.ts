/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import re from '.';

describe('Empty', () => {
    test('Empty.deriv(c)', () => {
        expect(re.Empty().deriv('a')).toEqual(re.Nil());
    });

    test('Empty.matches(c)', () => {
        const l = re.Empty();
        expect(l.matches('')).toBe(true);
        expect(l.matches('a')).toBe(false);
    });

    test('Empty.toString()', () => {
        expect(re.Empty().toString()).toBe('ε');
    });
});