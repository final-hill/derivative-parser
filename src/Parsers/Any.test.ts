/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import {Parser} from './';

describe('Any', () => {
    const p = new Parser();
    test('Any.deriv(c)', () => {
        expect(p.any().deriv('a')).toEqual(p.empty());
        expect(p.any().deriv('c')).toEqual(p.empty());
        expect(p.any().deriv(' ')).toEqual(p.empty());
    });

    test('Any.matches(c)', () => {
        expect(p.any().matches('a')).toBe(true);
        expect(p.any().matches('c')).toBe(true);
        expect(p.any().matches(' ')).toBe(true);
        expect(p.any().matches('ab')).toBe(false);
        expect(p.any().matches('')).toBe(false);
    });

    test('Any.toString()', () => {
        expect(p.any().toString()).toBe('.');
    });
});