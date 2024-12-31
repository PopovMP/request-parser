// types/index.d.ts
// noinspection JSUnusedGlobalSymbols

declare module "@popovmp/request-parser" {
    /**
     * Parses the path returns the path params or null if the path does not matches the template.
     *
     * @param {string} path
     * @param {string} template - URL template. It can use parameters designated with ":"
     *   supported tags:
     *     ":"  - alphanumeric, "-" and "_"
     *     "w:" - alphanumeric and "_" (word characters)
     *     "d:" - digits
     *     "b:" - boolean
     *     "*:" - any except "/". It decodes the parameter to a string.
     * @returns {Record<string, string|number|boolean> | null}
     * @throws {Error}    - Thrown if the template flag is not supported.
     * @throws {URIError} - Thrown if encodedURI contains a % not followed by two hexadecimal digits,
     *                      or if the escape sequence does not encode a valid UTF-8 character.
     */
    export function parsePathParams(path: string, template: string): Record<string, string|number|boolean> | null;

    /**
     * Parses the query parameters and return them as an object
     *
     * @param {string} queryText
     * @returns {Record<string, any> | null}
     */
    export function parseQueryParams(queryText: string): Record<string, any> | null;

    /**
     * Parses the request's body based on Content-Type.
     *
     * @param {Buffer} body
     * @param {string} contentType
     * @returns {Buffer|string|object|null|undefined}
     * @throws {Error}       - Thrown if the Content-Type header is missing or unsupported.
     * @throws {SyntaxError} - Thrown if the body is not a valid JSON.
     */
    export function parseRequestBody(body: Buffer, contentType: string): Buffer|string|object|null|undefined;

    /**
     * Parses the request's body and sets it to the "body" property.
     *
     * @param {string} formText
     * @returns {Record<string, any>}
     * @throws {URIError} - Thrown if encodedURI contains a % not followed by two hexadecimal digits,
     *                      or if the escape sequence does not encode a valid UTF-8 character.
     * @throws {SyntaxError} - Thrown if the value is not a valid JSON string.
     */
    export function parseFormData(formText: string): Record<string, any>;

    /**
     * @param {string} valueText
     *
     * @returns {number|boolean|null|string|object|Array<any>}
     *
     * @throws {SyntaxError} - If the value is not a valid JSON string.
     */
    export function parseValue(valueText: string): number|boolean|null|string|object|Array<any>;

    /**
     * Splits a Bearer token and returns the parts.
     * It returns an empty array if the Authorization header is missing or does not start with "Bearer ".
     *
     * @param {string|undefined } authorization  - The Authorization header
     * @param {string}            split
     * @param {number}            partsCount
     * @returns {string[]}
     */
    export function splitAuthToken(authorization: string, split: string, partsCount: number): string[];
}
