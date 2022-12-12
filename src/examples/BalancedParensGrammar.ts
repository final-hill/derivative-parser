/*!
 * @license
 * Copyright (C) 2022 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { Parser } from '../Parsers';
import Grammar from '../Grammar';

export class BalancedParensGrammar extends Grammar {
    TOP(): Parser { return this.S(); }
    S(): Parser {
        return this.cat(this.S(), '(', this.S(), ')').or('');
    }
}