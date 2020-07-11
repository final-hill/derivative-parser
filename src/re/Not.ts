/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import RegularLanguage from './RegularLanguage';

/**
 *
 */
class Not extends RegularLanguage {
    constructor(readonly language: RegularLanguage) {
        super(1 + language.height);
    }

    // TODO: toString
    // TODO
}

export default Not;