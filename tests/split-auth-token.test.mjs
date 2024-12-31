import {describe, it}    from "node:test";
import {deepStrictEqual} from "node:assert";

import {splitAuthToken} from "../index.mjs";

describe("splitAuthToken", () => {
    it("no header content", () => {
        /** @type {string} */
        const authorization = "";
        /** @type {string[]} */
        const expected = [];
        /** @type {string[]} */
        const actual = splitAuthToken(authorization, "", 1);
        deepStrictEqual(actual, expected);
    });

    it("no bearer", () => {
        /** @type {string} */
        const authorization = "Token foo.bar.baz";
        /** @type {string[]} */
        const expected = [];
        /** @type {string[]} */
        const actual = splitAuthToken(authorization, ".", 3);
        deepStrictEqual(actual, expected);
    });

    it("no bearer content", () => {
        /** @type {string} */
        const authorization = "Bearer";
        /** @type {string[]} */
        const expected = [];
        /** @type {string[]} */
        const actual = splitAuthToken(authorization, "", 1);
        deepStrictEqual(actual, expected);
    });

    it("splits one part", () => {
        /** @type {string} */
        const authorization = "Bearer foo";
        /** @type {string[]} */
        const expected = ["foo"];
        /** @type {string[]} */
        const actual = splitAuthToken(authorization, "", 1);
        deepStrictEqual(actual, expected);
    });

    it("splits multiple parts", () => {
        /** @type {string} */
        const authorization = "Bearer foo.bar.baz";
        /** @type {string[]} */
        const expected = ["foo", "bar", "baz"];
        /** @type {string[]} */
        const actual = splitAuthToken(authorization, ".", 3);
        deepStrictEqual(actual, expected);
    });

    it("wrong splitter", () => {
        /** @type {string} */
        const authorization = "Bearer foo.bar.baz";
        /** @type {string[]} */
        const expected = [];
        /** @type {string[]} */
        const actual = splitAuthToken(authorization, ";", 3);
        deepStrictEqual(actual, expected);
    });

    it("wrong count", () => {
        /** @type {string} */
        const authorization = "Bearer foo.bar.baz";
        /** @type {string[]} */
        const expected = [];
        /** @type {string[]} */
        const actual = splitAuthToken(authorization, ".", 2);
        deepStrictEqual(actual, expected);
    });
});
