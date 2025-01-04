// noinspection SpellCheckingInspection

import {describe, it}     from "node:test";
import {deepStrictEqual}  from "node:assert";

import {parsePathParams} from "../index.mjs";
import {stringToBase64Url} from "@popovmp/base64";

describe("parsePathParams", () => {
    describe("path without parameters", () => {
        it("when path matches gets {}", async () => {
            const path     = "/foo/bar/baz";
            const template = "/foo/bar/baz";
            const actual   = parsePathParams(path, template);
            const expected = {};
            deepStrictEqual(actual, expected);
        });

            it("when path does not match gets null", async () => {
            const path     = "/foo/bar";
            const template = "/foo/bar/baz";
            const actual   = parsePathParams(path, template);
            const expected = null;
            deepStrictEqual(actual, expected);
        });
    });

    describe("match alphanums and dash ':'", () => {
        it("path matches", async () => {
            const path     = "/api/foo_92-AB/bar-42";
            const template = "/api/:foo/:bar";
            const actual   = parsePathParams(path, template);
            const expected = {foo: "foo_92-AB", bar: "bar-42"};
            deepStrictEqual(actual, expected);
        });

        it("different count of segments", async () => {
            const path     = "/api/foo_92-AB/bar-42";
            const template = "/api/:foo/:bar/baz";
            const actual   = parsePathParams(path, template);
            const expected = null;
            deepStrictEqual(actual, expected);
        });
    });

    describe("match word chars 'w:'", () => {
        it("path matches", async () => {
            const path     = "/api/Foo_92/Bar_42";
            const template = "/api/w:foo/w:bar";
            const actual   = parsePathParams(path, template);
            const expected = {foo: "Foo_92", bar: "Bar_42"};
            deepStrictEqual(actual, expected);
        });

        it("does not match '-'", async () => {
            const path     = "/api/foo_92-AB/bar-42";
            const template = "/api/w:foo/w:bar";
            const actual   = parsePathParams(path, template);
            const expected = null;
            deepStrictEqual(actual, expected);
        });
    });

    describe("mach base64 text 'b64:'", () => {
        it("path matches", async () => {
            const text    = "Здравей, Свят!";
            const textB64  = stringToBase64Url(text);
            const path     = `/api/${textB64}/42`;
            const template = "/api/b64:hello/42";
            const actual   = parsePathParams(path, template);
            const expected = {hello: text};
            deepStrictEqual(actual, expected);
        });
    });

    describe("match digits 'd:'", () => {
        it("path matches", async () => {
            const path     = "/api/92/42";
            const template = "/api/d:foo/d:bar";
            const actual   = parsePathParams(path, template);
            const expected = {foo: 92, bar: 42};
            deepStrictEqual(actual, expected);
        });

        it("does not match alphas", async () => {
            const path     = "/api/92/bar";
            const template = "/api/d:foo/d:bar";
            const actual   = parsePathParams(path, template);
            const expected = null;
            deepStrictEqual(actual, expected);
        });
    });

    describe("mach anything except slash '*:'", () => {
        it("path matches", async () => {
            const path     = "/api/Hello, World!/Здравей, Свят!/42";
            const template = "/api/*:hello/*:zdravei/d:res";
            const actual   = parsePathParams(path, template);
            const expected = {
                hello  : "Hello, World!",
                zdravei: "Здравей, Свят!",
                res    : 42,
            };
            deepStrictEqual(actual, expected);
        });
    });
});
