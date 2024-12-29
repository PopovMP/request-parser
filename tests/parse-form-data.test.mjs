import {describe, it}            from "node:test";
import {deepStrictEqual, throws} from "node:assert";

import {parseFormData} from "../index.mjs";

describe("parseFormData", () => {
    it("should parse a simple form", () => {
        const formText = "name=John&age=30";
        const expected = {name: "John", age: 30};
        deepStrictEqual(parseFormData(formText), expected);
    });

    it("should handle empty values", () => {
        const formText = "name=John&age=&city=Oslo";
        const expected = {name: "John", age: "", city: "Oslo"};
        deepStrictEqual(parseFormData(formText), expected);
    });

    it("should decode URI components", () => {
        const formText = "name=John%20Doe&city=New%20York";
        const expected = {name: "John Doe", city: "New York"};
        deepStrictEqual(parseFormData(formText), expected);
    });

    it("should omit empty keys", () => {
        const formText = "=value&name=John";
        const expected = {name: "John"};
        deepStrictEqual(parseFormData(formText), expected);
    });

    it("should throw URIError for invalid URI components", () => {
        const formText = "name=John%G";
        throws(() => parseFormData(formText), URIError);
    });

    it("should throw SyntaxError for invalid JSON values", () => {
        const formText = "data={\"foo:42}"; // Missing quote
        throws(() => parseFormData(formText), SyntaxError);
    });
});
