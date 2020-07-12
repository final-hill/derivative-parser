/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import l, { Language } from "./";

describe('Complex tests', () => {
    test("L = L.'x' | ε", () => {
        const pattern = {
            get L(): Language {
                return l.Alt(l.Seq(this.L,'x'), l.EMPTY);
            }
        };

        expect(pattern.L.toString()).toBe("");
    });
});