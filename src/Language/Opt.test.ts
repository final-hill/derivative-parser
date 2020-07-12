/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import l from '.';

describe('Opt', () => {
    test('Opt.deriv(c)', () => {
        const lang = l.Opt(l.Char('a'));
        expect(lang.deriv('a').toString()).toBe(l.EMPTY.toString());
        // TODO
    });

    test('Opt.matches(c)', () => {
        const lang = l.Opt(l.Char('a'));

        expect(lang.matches('a')).toBe(true);

    });

    test('Opt.toString()', () => {
        // TODO
    });
});