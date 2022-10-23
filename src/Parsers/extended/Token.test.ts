/*!
 * @license
 * Copyright (C) 2022 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import {
    containsEmpty, deriv, height, isCat, isToken, matches, nilOrEmpty, Parser,
    toString
} from '..';

describe('Token', () => {
    const p = new Parser();

    test('Token[containsEmpty]', () => {
        expect(p.token('foo')[containsEmpty]()).toBe(false);
    });

    test('Token[height]()', () => {
        expect(p.token('foo')[height]()).toBe(0);
    });

    test('Token[isToken]', () => {
        expect(p.token('foo')[isToken]()).toBe(true);
        expect(p.token('foo')[isCat]()).toBe(false);
    });

    test('Token[deriv](c)', () => {
        expect(p.token('foo')[deriv]('x')).toEqual(p.cat(p.nil(), p.token('oo')));
        expect(p.token('foo')[deriv]('f')).toEqual(p.cat('', p.token('oo')));
    });

    test('Token[matches](c)', () => {
        const foo = p.token('foo');

        expect(foo[matches]('foo')).toBe(true);
        expect(foo[matches]('')).toBe(false);
        expect(foo[matches]('food')).toBe(false);
        expect(foo[matches]('fo')).toBe(false);
    });

    test('Token[nilOrEmpty]', () => {
        expect(p.token('foo')[nilOrEmpty]()).toEqual(p.nil());
    });

    test('Token[toString]()', () => {
        expect(p.token('foo')[toString]()).toBe('"foo"');
    });
});