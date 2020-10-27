/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import {Parser} from "./";

describe('Empty', () => {
    const p = new Parser();

    test('Empty.deriv(c)', () => {
        expect(p.empty().deriv('a')).toEqual(p.nil());
    });

    test('Empty.matches(c)', () => {
        expect(p.empty().matches('')).toBe(true);
        expect(p.empty().matches('a')).toBe(false);
    });

    test('Empty.toString()', () => {
        expect(p.empty().toString()).toBe('ε');
    });
});