/*!
 * @license
 * Copyright (C) 2022 Final Hill LLC
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */

import Grammar from '../Grammar';
import { Parser } from '../Parsers';

/**
 * @see https://tools.ietf.org/html/rfc3986#appendix-A
 */
export class UriGrammar extends Grammar {
    /**
     * TOP = scheme ":" hier-part [ "?" query ] [ "#" fragment ]
     * @returns {Parser} -
     */
    TOP(): Parser {
        return this.scheme().then(':', this.hierPart(), this.char('?').then(this.query().opt()), this.char('#').then(this.fragment()).opt());
    }
    /**
     * hier-part = "//" authority path-abempty | path-absolute | path-rootless | path-empty
     * @returns {Parser} -
     */
    hierPart(): Parser {
        return this.alt(
            this.token('//').then(this.authority(), this.pathAbempty()),
            this.pathAbsolute(),
            this.pathRootless(),
            this.pathEmpty()
        );
    }
    ALPHA() { return this.range('a', 'z').or(this.range('A', 'Z')); }
    /**
     * URI-reference = URI | relative-ref
     * @returns {Parser} -
     */
    UriReference(): Parser {
        return this.TOP().or(this.relativeRef());
    }
    /**
     * absolute-URI  = scheme ":" hier-part [ "?" query ]
     * @returns {Parser} -
     */
    absoluteUri(): Parser {
        return this.scheme().then(':', this.hierPart(), this.char('?').then(this.query()).opt());
    }
    /**
     * relative-ref  = relative-part [ "?" query ] [ "#" fragment ]
     * @returns {Parser} -
     */
    relativeRef(): Parser {
        return this.relativePart().then(this.char('?').then(this.query()).opt(), this.char('#').then(this.fragment()).opt());
    }
    /**
     * relative-part = "//" authority path-abempty | path-absolute | path-noscheme | path-empty
     * @returns {Parser} -
     */
    relativePart(): Parser {
        return this.alt(
            this.token('//').then(this.authority(), this.pathAbempty()),
            this.pathAbsolute(),
            this.pathNoscheme(),
            this.pathEmpty()
        );
    }
    //
    /**
     * scheme = ALPHA *( ALPHA | DIGIT | "+" | "-" | "." )
     * @returns {Parser} -
     */
    scheme(): Parser {
        return this.ALPHA().then(this.alt(this.ALPHA(), this.DIGIT(), '+', '-', '.').star());
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
        return this.alt(this.unreserved(), this.pctEncoded(), this.subDelims(), ':').star();
    }
    /**
     * host = IP-literal | IPv4address | reg-name
     * @returns {Parser} -
     */
    host(): Parser {
        return this.IpLiteral().or(this.IPv4address()).or(this.regName());
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
    IpLiteral(): Parser {
        return this.alt('[', this.IPv6address().or(this.IPvFuture()), ']');
    }
    /**
     * IPvFuture = "v" 1*HEXDIG "." 1*( unreserved | sub-delims | ":" )
     * @returns {Parser} -
     */
    IPvFuture(): Parser {
        return this.cat('v', this.HEXDIG().plus(), '.', this.alt(this.unreserved(), this.subDelims(), ':').plus());
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
            this.cat(this.h16(), ':', this.h16()),
            this.IPv4address()
        );
    }
    /**
     * IPv4address = dec-octet "." dec-octet "." dec-octet "." dec-octet
     * @returns {Parser} -
     */
    IPv4address(): Parser {
        return this.decOctet().then(this.char('.').then(this.decOctet()).rep(3));
    }
    /**
     * dec-octet = DIGIT                 ; 0-9
     *           | %x31-39 DIGIT         ; 10-99
     *           | "1" 2DIGIT            ; 100-199
     *           | "2" %x30-34 DIGIT     ; 200-249
     *           | "25" %x30-35          ; 250-255
     * @returns {Parser} -
     */
    decOctet(): Parser {
        return this.alt(
            this.DIGIT(), // 0-9
            this.range('1', '9').then(this.DIGIT()),   // 10-99
            this.char('1').then(this.DIGIT().rep(2)), // 100-199
            this.char('2').then(this.range('0', '4'), this.DIGIT()), // 200-249
            this.token('25').then(this.range('0', '5')) // 250-255
        );
    }
    /**
     * DIGIT = 0-9
     * @returns {Parser} -
     */
    DIGIT(): Parser {
        return this.range('0', '9');
    }
    /**
     * HEXDIG = 0-9 | A-F | a-f
     * @returns {Parser} -
     */
    HEXDIG(): Parser {
        return this.alt(this.range('0', '9'), this.range('A', 'F'), this.range('a', 'f'));
    }
    /**
     * reg-name = *( unreserved | pct-encoded | sub-delims )
     * @returns {Parser} -
     */
    regName(): Parser {
        return this.alt(this.unreserved(), this.pctEncoded(), this.subDelims()).star();
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
            this.pathAbempty(),
            this.pathAbsolute(),
            this.pathNoscheme(),
            this.pathRootless(),
            this.pathEmpty()
        );
    }
    /**
     * path-abempty = *( "/" segment )
     * @returns {Parser} -
     */
    pathAbempty(): Parser {
        return this.char('/').then(this.segment()).star();
    }
    /**
     * path-absolute = "/" [ segment-nz *( "/" segment ) ]
     * @returns {Parser} -
     */
    pathAbsolute(): Parser {
        return this.char('/').then(this.segmentNz().then(this.char('/').then(this.segment().star())).opt());
    }
    /**
     * path-noscheme = segment-nz-nc *( "/" segment )
     * @returns {Parser} -
     */
    pathNoscheme(): Parser {
        return this.segmentNzNc().then(this.char('/').then(this.segment()).star());
    }
    /**
     * path-rootless = segment-nz *( "/" segment )
     * @returns {Parser} -
     */
    pathRootless(): Parser {
        return this.segmentNz().then(this.char('/').then(this.segment()).star());
    }
    /**
     * path-empty = 0<pchar>
     */
    pathEmpty(): Parser {
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
    segmentNz(): Parser {
        return this.pchar().plus();
    }
    /**
     *  segment-nz-nc = 1*( unreserved | pct-encoded | sub-delims | "@" ) ; non-zero-length segment without any colon ":"
     * @returns {Parser} -
     */
    segmentNzNc(): Parser {
        return this.alt(this.unreserved(), this.pctEncoded(), this.subDelims(), '@').plus();
    }
    /**
     * pchar = unreserved | pct-encoded | sub-delims | ":" | "@"
     * @returns {Parser} -
     */
    pchar(): Parser {
        return this.alt(this.unreserved(), this.pctEncoded(), this.subDelims(), ':', '@');
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
    pctEncoded(): Parser {
        return this.cat('%', this.HEXDIG(), this.HEXDIG());
    }
    /**
     * unreserved = ALPHA | DIGIT | "-" | "." | "_" | "~"
     * @returns {Parser} -
     */
    unreserved(): Parser {
        return this.alt(this.ALPHA(), this.DIGIT(), '-', '.', '_', '~');
    }
    /**
     * reserved = gen-delims | sub-delims
     * @returns {Parser} -
     */
    reserved(): Parser {
        return this.genDelims().or(this.subDelims());
    }
    /**
     * gen-delims = ":" | "/" | "?" | "#" | "[" | "]" | "@"
     * @returns {Parser} -
     */
    genDelims(): Parser {
        return this.alt(':', '/', '?', '#', '[', ']', '@');
    }
    /**
     * sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
     * / "*" / "+" / "," / ";" / "="
     */
    subDelims(): Parser {
        throw new Error('Not Implemented');
    }
}