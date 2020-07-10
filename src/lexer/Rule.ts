/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { RegularLanguage } from '../re';
import { Action } from './Action';

class Rule {
    constructor(
        public regex: RegularLanguage,
        public action: Action
    ) {}

    match(input: string): boolean {
        let i = 0,
            m = this.regex.deriv(input[i]);
        while(input[i] && !m.isNil())
    }
}

export default Rule;