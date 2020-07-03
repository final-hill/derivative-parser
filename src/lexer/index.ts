/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import State from './State';

const lexer = Object.assign(Object.create(null), {
    State() { return new State(); }
});

export default lexer;