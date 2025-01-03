import {TextDecoder} from "node:util";

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
 *                        or if the escape sequence does not encode a valid UTF-8 character.
 */
export function parsePathParams(path, template) {
    /** @type { Record<string, string|number|boolean> } */
    const params = {};

    /** @type {string[]} */
    const pathParts = path.split("/");

    /** @type {string[]} */
    const templateParts = template.split("/");

    if (pathParts.length !== templateParts.length) {
        return null;
    }

    for (let i = 0; i < templateParts.length; i++) {
        /** @type {string} */
        const templatePart = templateParts[i];
        /** @type {string} */
        const pathPart = pathParts[i];

        /** @type {number} */
        const colonIndex = templatePart.indexOf(":");
        if (colonIndex === -1) {
            if (pathPart !== templatePart) return null;
            continue;
        }

        /** @type {string} */
        const paramFlag = templatePart.slice(0, colonIndex + 1);

        /** @type {string} */
        const key = templatePart.slice(colonIndex + 1);

        switch (paramFlag) {
            case ":": { // Alphanumeric characters, "_", and "-"
                if (/^[\w-]+$/.test(pathPart)) {
                    params[key] = pathPart;
                    break;
                }
                return null;
            }
            case "w:": { // Word characters (alphanumeric characters and "_")
                if (/^\w+$/.test(pathPart)) {
                    params[key] = pathPart;
                    break;
                }
                return null;
            }
            case "d:": { // Digits
                if (/^\d+$/.test(pathPart)) {
                    params[key] = parseInt(pathPart, 10);
                    break;
                }
                return null;
            }
            case "b:": { // Boolean
                if (pathPart === "true") {
                    params[key] = true;
                    break;
                }
                if (pathPart === "false") {
                    params[key] = false;
                    break;
                }
                return null;
            }
            case "*:": { // Any except "/"
                if (!pathPart.includes("/")) {
                    params[key] = decodeURIComponent(pathPart);
                    break;
                }
                return null;
            }
            default: {
                throw new Error(`Unsupported template flag: ${paramFlag}`);
            }
        }
    }

    return params;
}

/**
 * Parse query parameters and return them as an object
 * @param {string} queryText
 * @returns {Record<string, any>|null}
 */
export function parseQueryParams(queryText) {
    if (!queryText.includes("=")) return null;

    return parseFormData(queryText);
}

/**
 * Parses the request's body and sets it to the "body" property.
 * It parses the body based on the Content-Type header.
 * @param {Buffer} body
 * @param {string} contentType
 * @returns {Buffer|string|any|undefined}
 * @throws {Error}       - Thrown if the Content-Type header is missing or unsupported.
 * @throws {SyntaxError} - Thrown if the body is not a valid JSON.
 */
export function parseRequestBody(body, contentType) {
    if (body.length === 0) return; // Empty body

    if (contentType.startsWith("application/json")) {
        /** @type {string} */
        const bodyText = new TextDecoder().decode(body);
        return JSON.parse(bodyText);
    }

    if (contentType.startsWith("application/x-www-form-urlencoded")) {
        /** @type {string} */
        const bodyText = new TextDecoder().decode(body);
        return parseFormData(bodyText);
    }

    if (contentType.startsWith("text")) {
        return new TextDecoder().decode(body);
    }

    return body;
}

/**
 * Parses the request's body and sets it to the "body" property.
 * @param {string} formText
 * @returns {Record<string, any>}
 * @throws {URIError} - Thrown if encodedURI contains a % not followed by two hexadecimal digits,
 *                      or if the escape sequence does not encode a valid UTF-8 character.
 * @throws {SyntaxError} - Thrown if the value is not a valid JSON string.
 */
export function parseFormData(formText) {
    /** @type {Record<string, any>} */
    const form = {};

    for (const keyVal of formText.split("&")) {
        const [key, val] = keyVal.split("=");
        if (key !== "") {
            const decodedKey = decodeURIComponent(key);
            const decodedVal = val ? decodeURIComponent(val) : "";
            form[decodedKey] = parseValue(decodedVal);
        }
    }

    return form;
}

/**
 * @param {string} valueText
 *
 * @returns {number|boolean|null|string|object|Array<any>}
 *
 * @throws {SyntaxError} - If the value is not a valid JSON string.
 */
export function parseValue(valueText) {
    if (!valueText) {
        return valueText;
    }

    if (valueText === "true") {
        return true;
    }

    if (valueText === "false") {
        return false;
    }

    if (valueText === "null") {
        return null;
    }

    if (valueText.match(/^[-+]?\d+$/)) {
        return parseInt(valueText);
    }

    if (valueText.match(/^[-+]?\d*\.\d+$/)) {
        return parseFloat(valueText);
    }

    if ((valueText.startsWith("{") && valueText.endsWith("}")) ||
        (valueText.startsWith("[") && valueText.endsWith("]"))) {
        return JSON.parse(valueText);
    }

    return valueText;
}

/**
 * Splits a Bearer token and returns the parts.
 * It returns an empty array if the Authorization header is missing or does not start with "Bearer ".
 *
 * @param {string|undefined } authorization  - The Authorization header
 * @param {string}            split
 * @param {number}            partsCount
 * @returns {string[]}
 */
export function splitAuthToken(authorization, split, partsCount) {
    if (!authorization || !authorization.startsWith("Bearer ")) {
        return [];
    }

    const authToken = authorization.slice(7);
    if (!authToken || !authToken.includes(split)) {
        return [];
    }

    if (split === "" && partsCount === 1) {
        return [authToken];
    }

    const parts = authToken.split(split);
    if (parts.length !== partsCount) {
        return [];
    }

    return parts;
}
