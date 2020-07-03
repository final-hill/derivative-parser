/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { RegularLanguage } from '../re';
import State from './State';

type Action = (match: string[], rest: string, state: typeof State) => void;

class Rule {
    constructor(
        public regex: RegularLanguage,
        public action: Action
    ) {}

    match(input: string): boolean {
        return this.regex.matches(input);
    }
}

export default Rule;