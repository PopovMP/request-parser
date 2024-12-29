import {describe, it}    from "node:test";
import {deepStrictEqual} from "node:assert";

import {splitAuthToken} from "../index.mjs";

describe("splitAuthToken", () => {
    it("no header content", () => {
        const authorization = "";
        const expected = [];
        const actual = splitAuthToken(authorization, "", 1);
        deepStrictEqual(actual, expected);
    });

    it("no bearer", () => {
        const authorization = "Token foo.bar.baz";
        const expected = [];
        const actual = splitAuthToken(authorization, ".", 3);
        deepStrictEqual(actual, expected);
    });

    it("no bearer content", () => {
        const authorization = "Bearer";
        const expected = [];
        const actual = splitAuthToken(authorization, "", 1);
        deepStrictEqual(actual, expected);
    });

    it("splits one part", () => {
        const authorization = "Bearer foo";
        const expected = ["foo"];
        const actual = splitAuthToken(authorization, "", 1);
        deepStrictEqual(actual, expected);
    });

    it("splits multiple parts", () => {
        const authorization = "Bearer foo.bar.baz";
        const expected = ["foo", "bar", "baz"];
        const actual = splitAuthToken(authorization, ".", 3);
        deepStrictEqual(actual, expected);
    });

    it("wrong splitter", () => {
        const authorization = "Bearer foo.bar.baz";
        const expected = [];
        const actual = splitAuthToken(authorization, ";", 3);
        deepStrictEqual(actual, expected);
    });

    it("wrong count", () => {
        const authorization = "Bearer foo.bar.baz";
        const expected = [];
        const actual = splitAuthToken(authorization, ".", 2);
        deepStrictEqual(actual, expected);
    });
});
