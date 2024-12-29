import {describe, it}                 from "node:test";
import {deepStrictEqual, strictEqual} from "node:assert";
import {TextEncoder}                  from "node:util";
import buffer from "node:buffer";
const {Buffer} = buffer;

import {parseRequestBody} from "../index.mjs";

describe("parseRequestBody", () => {
    it("Parses an empty body", () => {
        const actual   = parseRequestBody(Buffer.from([]), "application/json");
        const expected = undefined;

        strictEqual(actual, expected);
    });

    it("Parses an octet-stream body", () => {
        const text     = "Здравей, Свят!";
        const bytes    = new TextEncoder().encode(text);
        const body     = Buffer.from(bytes);
        const actual   = parseRequestBody(body, "application/octet-stream");

        deepStrictEqual(actual, body);
    });

    it("Parses a text body", () => {
        const text     = "Здравей, Свят!";
        const bytes    = new TextEncoder().encode(text);
        const body     = Buffer.from(bytes);
        const actual   = parseRequestBody(body, "text/plain");

        strictEqual(actual, text);
    });

    it("Parses a JSON body", () => {
        const dto    = {foo: "Здравей", bar: 42};
        const text   = JSON.stringify(dto);
        const bytes  = new TextEncoder().encode(text);
        const body   = Buffer.from(bytes);
        const actual = parseRequestBody(body, "application/json");

        deepStrictEqual(actual, dto);
    });

    it("Parses a form body", () => {
        const inputText  = "foo=Здравей&bar=42";
        const inputBytes = new TextEncoder().encode(inputText);
        const actual     = parseRequestBody(Buffer.from(inputBytes), "application/x-www-form-urlencoded");
        const expected   = {foo: "Здравей", bar: 42};

        deepStrictEqual(actual, expected);
    });
});
