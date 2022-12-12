/*!
 * @license
 * Copyright (C) 2022 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import { matches } from '../Parsers';
import { UriGrammar } from './UriGrammar';

describe('UriGrammar', () => {
    const uriGrammar = new UriGrammar();

    test('UriGrammar defined', () => {
        expect(uriGrammar).toBeDefined();
    });

    test('matches empty', () => {
        expect(uriGrammar[matches]('')).toBe(true);
    });

    test('doesn\'t match scheme', () => {
        expect(uriGrammar[matches]('https://')).toBe(false);
    });

    test('test doesn\t match arbitrary', () => {
        expect(uriGrammar[matches]('::xyz')).toBe(false);
    });

    test('matches tel', () => {
        expect(uriGrammar[matches]('tel:+1-816-555-1212')).toBe(true);
    });

    test('matches ftp', () => {
        expect(uriGrammar[matches]('ftp://ftp.is.co.za/rfc/rfc1808.txt')).toBe(true);
    });

    test('matches http', () => {
        expect(uriGrammar[matches]('http://www.ietf.org/rfc/rfc2396.txt')).toBe(true);
    });

    test('matches ldap', () => {
        expect(uriGrammar[matches]('ldap://[2001:db8::7]/c=GB?objectClass?one')).toBe(true);
    });

    test('matches mailto', () => {
        expect(uriGrammar[matches]('mailto:John.Doe@example.com')).toBe(true);
    });

    test('matches news', () => {
        expect(uriGrammar[matches]('news:comp.infosystems.www.servers.unix')).toBe(true);
    });

    test('matches telnet', () => {
        expect(uriGrammar[matches]('telnet://192.0.2.16:80/')).toBe(true);
    });

    test('matches urn', () => {
        expect(uriGrammar[matches]('urn:oasis:names:specification:docbook:dtd:xml:4.1.2')).toBe(true);
    });
});