import {describe, it}            from "node:test";
import {deepStrictEqual, throws} from "node:assert";

import {parseQueryParams} from "../index.mjs";

describe("parseQueryParams", () => {
    it("should parse a simple form", () => {
        const queryText = "name=John&age=30";
        const expected  = {name: "John", age: 30};
        deepStrictEqual(parseQueryParams(queryText), expected);
    });

    it("should handle empty values", () => {
        const queryText = "name=John&age=&city=Oslo";
        const expected  = {name: "John", age: "", city: "Oslo"};
        deepStrictEqual(parseQueryParams(queryText), expected);
    });

    it("should decode URI components", () => {
        const queryText = "name=John%20Doe&city=New%20York";
        const expected  = {name: "John Doe", city: "New York"};
        deepStrictEqual(parseQueryParams(queryText), expected);
    });

    it("should decode JSON objects", () => {
        const queryText = "data={\"foo\":42}";
        const expected  = {data: {foo: 42}};
        deepStrictEqual(parseQueryParams(queryText), expected);
    });

    it("should omit empty keys", () => {
        const queryText = "=value&name=John";
        const expected  = {name: "John"};
        deepStrictEqual(parseQueryParams(queryText), expected);
    });

    it("should throw URIError for invalid URI components", () => {
        const queryText = "name=John%G";
        throws(() => parseQueryParams(queryText), URIError);
    });

    it("should throw SyntaxError for invalid JSON values", () => {
        const queryText = "data={\"foo:42}"; // Missing quote
        throws(() => parseQueryParams(queryText), SyntaxError);
    });
});
