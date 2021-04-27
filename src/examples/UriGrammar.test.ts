/*!
 * @license
 * Copyright (C) 2021 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import Grammar from '../Grammar';
import { Parser } from '../Parsers';

describe('UriGrammar', () => {
    test('UriGrammar', () => {
        /**
         * @see https://tools.ietf.org/html/rfc3986#appendix-A
         */
        class UriGrammar extends Grammar {
            /**
             * URI = scheme ":" hier-part [ "?" query ] [ "#" fragment ]
             * @returns {Parser} -
             */
            URI(): Parser {
                return this.scheme().then(':',this.hier_part(),this.char('?').then(this.query().opt()),this.char('#').then(this.fragment()).opt());
            }
            /**
             * hier-part = "//" authority path-abempty | path-absolute | path-rootless | path-empty
             * @returns {Parser} -
             */
            hier_part(): Parser {
                return this.alt(
                    this.token('//').then(this.authority(),this.path_abempty()),
                    this.path_absolute(),
                    this.path_rootless(),
                    this.path_empty()
                );
            }
            ALPHA(){ return this.range('a','z').or(this.range('A','Z')); }
            /**
             * URI-reference = URI | relative-ref
             * @returns {Parser} -
             */
            URI_reference(): Parser {
                return this.URI().or(this.relative_ref());
            }
            /**
             * absolute-URI  = scheme ":" hier-part [ "?" query ]
             * @returns {Parser} -
             */
            absolute_URI(): Parser {
                return this.scheme().then(':',this.hier_part(),this.char('?').then(this.query()).opt());
            }
            /**
             * relative-ref  = relative-part [ "?" query ] [ "#" fragment ]
             * @returns {Parser} -
             */
            relative_ref(): Parser {
                return this.relative_part().then(this.char('?').then(this.query()).opt(),this.char('#').then(this.fragment()).opt());
            }
            /**
             * relative-part = "//" authority path-abempty | path-absolute | path-noscheme | path-empty
             * @returns {Parser} -
             */
            relative_part(): Parser {
                return this.alt(
                    this.token('//').then(this.authority(), this.path_abempty()),
                    this.path_absolute(),
                    this.path_noscheme(),
                    this.path_empty()
                );
            }
            //
            /**
             * scheme = ALPHA *( ALPHA | DIGIT | "+" | "-" | "." )
             * @returns {Parser} -
             */
            scheme(): Parser {
                return this.ALPHA().then(this.alt(this.ALPHA(),this.DIGIT(),'+','-','.').star());
            }
            /**
             * authority = [ userinfo "@" ] host [ ":" port ]
             * @returns {Parser} -
             */
            authority(): Parser {
                return this.userinfo().then('@').opt().then(this.host()).then(this.char(':').then(this.port()).opt());
            }
            /**
             * userinfo = *( unreserved | pct-encoded | sub-delims | ":" )
             * @returns {Parser} -
             */
            userinfo(): Parser {
                return this.alt(this.unreserved(),this.pct_encoded(),this.sub_delims(),':').star();
            }
            /**
             * host = IP-literal | IPv4address | reg-name
             * @returns {Parser} -
             */
            host(): Parser {
                return this.IP_literal().or(this.IPv4address()).or(this.reg_name());
            }
            /**
             * port = *DIGIT
             * @returns {Parser} -
             */
            port(): Parser {
                return this.DIGIT().star();
            }
            /**
             * IP-literal = "[" ( IPv6address | IPvFuture  ) "]"
             * @returns {Parser} -
             */
            IP_literal(): Parser {
                return this.alt('[', this.IPv6address().or(this.IPvFuture()) ,']');
            }
            /**
             * IPvFuture = "v" 1*HEXDIG "." 1*( unreserved | sub-delims | ":" )
             * @returns {Parser} -
             */
            IPvFuture(): Parser {
                return this.cat('v', this.HEXDIG().plus(), '.', this.alt(this.unreserved(), this.sub_delims(), ':').plus());
            }
            /**
             * IPv6address =                            6( h16 ":" ) ls32
             *             |                       "::" 5( h16 ":" ) ls32
             *             | [               h16 ] "::" 4( h16 ":" ) ls32
             *             | [ *1( h16 ":" ) h16 ] "::" 3( h16 ":" ) ls32
             *             | [ *2( h16 ":" ) h16 ] "::" 2( h16 ":" ) ls32
             *             | [ *3( h16 ":" ) h16 ] "::"    h16 ":"   ls32
             *             | [ *4( h16 ":" ) h16 ] "::"              ls32
             *             | [ *5( h16 ":" ) h16 ] "::"              h16
             *             | [ *6( h16 ":" ) h16 ] "::"
             * @returns {Parser} -
             */
            IPv6address(): Parser {
                return this.alt(
                    // TODO
                );
            }
            /**
             * h16 = 1*4HEXDIG
             * @returns {Parser} -
             */
            h16(): Parser {
                return this.HEXDIG().rep(4);
            }
            /**
             * ls32 = ( h16 ":" h16 ) | IPv4address
             * @returns {Parser} -
             */
            ls32(): Parser {
                return this.alt(
                    this.cat(this.h16(),':',this.h16()),
                    this.IPv4address()
                );
            }
            /**
             * IPv4address = dec-octet "." dec-octet "." dec-octet "." dec-octet
             * @returns {Parser} -
             */
            IPv4address(): Parser {
                return this.dec_octet().then(this.char('.').then(this.dec_octet()).rep(3));
            }
            /**
             * dec-octet = DIGIT                 ; 0-9
             *           | %x31-39 DIGIT         ; 10-99
             *           | "1" 2DIGIT            ; 100-199
             *           | "2" %x30-34 DIGIT     ; 200-249
             *           | "25" %x30-35          ; 250-255
             * @returns {Parser} -
             */
            dec_octet(): Parser {
                return this.alt(
                    this.DIGIT(), // 0-9
                    this.range('1','9').then(this.DIGIT()),   // 10-99
                    this.char('1').then(this.DIGIT().rep(2)), // 100-199
                    this.char('2').then(this.range('0','4'),this.DIGIT()), // 200-249
                    this.token('25').then(this.range('0','5')) // 250-255
                );
            }
            /**
             * DIGIT = 0-9
             * @returns {Parser} -
             */
            DIGIT(): Parser {
                return this.range('0','9');
            }
            /**
             * HEXDIG = 0-9 | A-F | a-f
             * @returns {Parser} -
             */
            HEXDIG(): Parser {
                return this.alt(this.range('0','9'),this.range('A','F'),this.range('a','f'));
            }
            /**
             * reg-name = *( unreserved | pct-encoded | sub-delims )
             * @returns {Parser} -
             */
            reg_name(): Parser {
                return this.alt(this.unreserved(), this.pct_encoded(), this.sub_delims()).star();
            }
            /**
             * path = path-abempty    ; begins with "/" or is empty
             *      | path-absolute   ; begins with "/" but not "//"
             *      | path-noscheme   ; begins with a non-colon segment
             *      | path-rootless   ; begins with a segment
             *      | path-empty      ; zero characters
             * @returns {Parser} -
             */
            path(): Parser {
                return this.alt(
                    this.path_abempty(),
                    this.path_absolute(),
                    this.path_noscheme(),
                    this.path_rootless(),
                    this.path_empty()
                );
            }
            /**
             * path-abempty = *( "/" segment )
             * @returns {Parser} -
             */
            path_abempty(): Parser {
                return this.char('/').then(this.segment()).star();
            }
            /**
             * path-absolute = "/" [ segment-nz *( "/" segment ) ]
             * @returns {Parser} -
             */
            path_absolute(): Parser {
                return this.char('/').then(this.segment_nz().then(this.char('/').then(this.segment().star())).opt());
            }
            /**
             * path-noscheme = segment-nz-nc *( "/" segment )
             * @returns {Parser} -
             */
            path_noscheme(): Parser {
                return this.segment_nz_nc().then(this.char('/').then(this.segment()).star());
            }
            /**
             * path-rootless = segment-nz *( "/" segment )
             * @returns {Parser} -
             */
            path_rootless(): Parser {
                return this.segment_nz().then(this.char('/').then(this.segment()).star());
            }
            /**
             * path-empty = 0<pchar>
             */
            path_empty(): Parser {
                throw new Error('Not Implemented');
                // TODO
            }
            /**
             * segment = *pchar
             * @returns {Parser} -
             */
            segment(): Parser {
                return this.pchar().star();
            }
            /**
             * segment-nz = 1*pchar
             * @returns {Parser} -
             */
            segment_nz(): Parser {
                return this.pchar().plus();
            }
            /**
             *  segment-nz-nc = 1*( unreserved | pct-encoded | sub-delims | "@" ) ; non-zero-length segment without any colon ":"
             * @returns {Parser} -
             */
            segment_nz_nc(): Parser {
                return this.alt(this.unreserved(), this.pct_encoded(), this.sub_delims(), '@').plus();
            }
            /**
             * pchar = unreserved | pct-encoded | sub-delims | ":" | "@"
             * @returns {Parser} -
             */
            pchar(): Parser {
                return this.alt(this.unreserved(), this.pct_encoded(), this.sub_delims(), ':', '@');
            }
            /**
             * query = *( pchar | "/" | "?" )
             * @returns {Parser} -
             */
            query(): Parser {
                return this.alt(this.pchar(), '/', '?').star();
            }
            /**
             * fragment = *( pchar | "/" | "?" )
             * @returns {Parser} -
             */
            fragment(): Parser {
                return this.alt(this.pchar(), '/', '?').star();
            }
            /**
             * pct-encoded = "%" HEXDIG HEXDIG
             * @returns {Parser} -
             */
            pct_encoded(): Parser {
                return this.cat('%', this.HEXDIG(), this.HEXDIG());
            }
            /**
             * unreserved = ALPHA | DIGIT | "-" | "." | "_" | "~"
             * @returns {Parser} -
             */
            unreserved(): Parser {
                return this.alt(this.ALPHA(),this.DIGIT(), '-', '.', '_', '~');
            }
            /**
             * reserved = gen-delims | sub-delims
             * @returns {Parser} -
             */
            reserved(): Parser {
                return this.gen_delims().or(this.sub_delims());
            }
            /**
             * gen-delims = ":" | "/" | "?" | "#" | "[" | "]" | "@"
             * @returns {Parser} -
             */
            gen_delims(): Parser {
                return this.alt(':', '/', '?', '#', '[', ']', '@');
            }
            /**
             * sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
             * / "*" / "+" / "," / ";" / "="
             */
            sub_delims(): Parser {
                throw new Error('Not Implemented');
            }
        }

        const uriGrammar = new UriGrammar();

        expect(uriGrammar).toBeDefined();

        /*
        expect(uriGrammar.matches('ftp://ftthis.is.co.za/rfc/rfc1808.txt')).toBe(true);
        expect(uriGrammar.matches('http://www.ietf.org/rfc/rfc2396.txt')).toBe(true);
        expect(uriGrammar.matches('ldap://[2001:db8::7]/c=GB?objectClass?one')).toBe(true);
        expect(uriGrammar.matches('mailto:John.Doe@example.com')).toBe(true);
        expect(uriGrammar.matches('news:comthis.infosystems.www.servers.unix')).toBe(true);
        expect(uriGrammar.matches('tel:+1-816-555-1212')).toBe(true);
        expect(uriGrammar.matches('telnet://192.0.2.16:80/')).toBe(true);
        expect(uriGrammar.matches('urn:oasis:names:specification:docbook:dtd:xml:4.1.2')).toBe(true);
        expect(uriGrammar.matches('')).toBe(false);
        expect(uriGrammar.matches('::xyz')).toBe(false);
        expect(uriGrammar.matches('https:\\')).toBe(false);
        */
    });
});