/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import re from '.';

describe('Opt', () => {
    test('Opt.deriv(c)', () => {
        const l = re.Opt(re.Char('a'));
        expect(l.deriv('a').toString()).toBe(re.EMPTY);
        // TODO
    });

    test('Opt.matches(c)', () => {
        const l = re.Opt(re.Char('a'));

        expect(l.matches('a')).toBe(true);

    });

    test('Opt.toString()', () => {
        // TODO
    });
});