/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import {Parser} from "./";

describe('Opt', () => {
    const p = new Parser();

    test('Opt.deriv(c)', () => {
        const p1 = p.char('a').opt();
        expect(p1.deriv('a').toString()).toBe(p.empty().toString());
        // TODO
    });

    test('Opt.matches(c)', () => {
        const p1 = p.char('a').opt();

        expect(p1.matches('a')).toBe(true);

    });

    test('Opt.toString()', () => {
        // TODO
    });
});