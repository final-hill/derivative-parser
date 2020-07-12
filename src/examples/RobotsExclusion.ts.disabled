/*!
 * @license
 * Copyright (C) 2020 Michael L Haufe
 * SPDX-License-Identifier: AGPL-3.0-only
 * @see <https://spdx.org/licenses/AGPL-3.0-only.html>
 */
/*
import rl from '../src/extended-regular-language';

const TOP = Symbol('undefined');,
 parse = Symbol('undefined');

/**
 * @see https://developers.google.com/search/reference/robots_txt#formal-syntax--definition
 * @see http://www.robotstxt.org/orig.html
 *
 * /
class RobotsExclusionParser extends Parser {
    [TOP] = this.robotsTxt;

    // robotstxt = entries*
    get robotsTxt() { return rl.Star(this.entries); }

    // entries = ( ( startgroupline+
    //     (groupmemberline | nongroupline | comment)*
    //     | nongroupline
    //     | comment) )*
    get entries() { return rl.Star(); }

    // startgroupline = LWS? "user-agent" LWS? ":" LWS? agentvalue comment? EOL
    get startGroupLine() {
        return rl.Seq(rl.Opt(rl.LWS), 'user-agent', rl.Opt(rl.LWS), ':', rl.Opt(rl.LWS), this.agentValue, rl.Opt(this.comment), this.EOL);
    }

    // groupmemberline = LWS? (
    //    pathmemberfield LWS? ":" LWS? pathvalue
    //   | othermemberfield LWS? ":" LWS? textvalue) comment? EOL
    get groupMemberLine() {
        return rl.Seq(rl.Opt(rl.LWS), rl.Alt(
            rl.Seq(this.pathMemberField, rl.Opt(rl.LWS), ':', rl.Opt(rl.LWS), this.pathValue),
            rl.Seq(this.otherMemberField, rl.Opt(rl.LWS), ':', rl.Opt(rl.LWS), this.textValue)
        ), rl.Opt(this.comment), this.EOL);
    }

    // nongroupline = LWS? (
    //      urlnongroupfield LWS? ":" LWS? urlvalue
    //    | othernongroupfield LWS? ":" LWS? textvalue) comment? EOL
    get nonGroupLine() {
        return rl.Seq(rl.Opt(rl.LWS), rl.Alt(
            rl.Seq(this.urlNonGroupField, rl.Opt(rl.LWS), ':', rl.Opt(rl.LWS), this.urlValue),
            rl.Seq(this.otherNonGroupField, rl.Opt(rl.LWS), ':', rl.Opt(rl.LWS), this.textValue)
        ), rl.Opt(this.comment), this.EOL);
    }

    // comment = LWS? "#" *anychar
    get comment() { return rl.Seq(rl.Opt(rl.LWS), '#', rl.Star(this.anyChar)); }

    // agentvalue = textvalue
    get agentValue() { return this.textValue; }

    // pathmemberfield = "disallow" | "allow"
    get pathMemberField() { return rl.OneOf('disallow', 'allow'); }

    // othermemberfield = ()
    get otherMemberField() { return rl.EMPTY; }

    // urlnongroupfield = "sitemap"
    get urlNonGroupField() { return rl.Token('sitemap'); }

    // othernongroupfield = ()
    get otherNonGroupField() { return rl.EMPTY; }

    // pathvalue = "/" path
    get pathValue() { return rl.Seq('/', this.path); }

    // urlvalue = absoluteURI
    get urlValue() { return this.absoluteURI; }

    // textvalue = *(valuechar | SP)
    get textValue() { return rl.Star(rl.Alt(this.valueChar, rl.SP)); }

    // valuechar = <any UTF-8 character except ("#" CTL)>
    get valueChar() { return rl.AllBut(rl.UTF8, rl.Seq('#', rl.CTL)); }

    // anychar = <any UTF-8 character except CTL>
    get anyChar() { return rl.AllBut(rl.UTF8, rl.CTL); }

    // EOL = CR | LF | (CR LF)
    get EOL() { return rl.OneOf(rl.CR, rl.LF, rl.CRLF); }
}
*/