/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import {Parser} from "./";

describe('Not', () => {
    const p = new Parser();

    test('Not.deriv(c)', () => {
        expect(
            p.char('a').not().deriv('a').toString()
        ).toEqual(
            p.empty().not().toString()
        );
        expect(
            p.char('a').not().deriv('b').toString()
        ).toEqual(
            p.nil().not().toString()
        );
    });

    test('Not.equals()', () => {
        const notA = p.char('a').not(),
              notA2 = p.char('a').not(),
              notB = p.char('b').not();

        expect(notA.equals(notA)).toEqual(true);
        expect(notA.equals(notA2)).toEqual(true);
        expect(notA.equals(notB)).toEqual(false);
        expect(notA.equals(p.char('a'))).toEqual(false);
    });

    test('Not.matches(c)', () => {
        const lang = p.char('a').not();

        expect(lang.matches('a')).toBe(false);
        expect(lang.matches('b')).toBe(true);
    });

    test('Not.toString()', () => {
        expect(
            p.char('a').not().toString()
        ).toBe('¬\'a\'');
        expect(
            p.char('a').or(p.char('b')).not().toString()
        ).toBe('¬(\'a\'|\'b\')');
    });
});