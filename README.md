# Request Parser

Helper functions to parse and validate request data.

### Parse URL path parameters

```function parsePathParams(path, template)```

It matches the URL path with a template and returns the path parameters.

```javascript
import {parsePathParams} from "@popovmp/request-parser";

const path = "/users/trial/true/42";
const template = "/users/:kind/b:isTrial/d:count";

const pathParams = parsePathParams(path, template);

console.log(pathParams); // { kind: "trial", isTrial: true, count: 42 }
```

### Parse request body

```function parseRequestBody(body, contentType)```

It parses the request body based on the content type.

```javascript
import {parseRequestBody} from "@popovmp/request-parser";

const dto    = {hello: "Hello, World!", answer: 42};
const text   = JSON.stringify(dto);
const bytes  = new TextEncoder().encode(text);
const body   = Buffer.from(bytes);

const result = parseRequestBody(body, "application/json");

console.log(result); // { hello: "Hello, World!", answer: 42 }
```

### Parse Form Data

```function parseFormData(formText)```

```javascript
import {parseFormData} from "@popovmp/request-parser";

const formText = "hello=Hello%2C+World%21&answer=42";
const result   = parseFormData(formText);
console.log(result); // { hello: "Hello, World!", answer: 42 }
```

### Parse Query String

```function parseQueryParams(queryText)```

```javascript
import {parseQueryParams} from "@popovmp/request-parser";

const queryText = "hello=Hello%2C+World%21&answer=42";
const result    = parseQueryParams(queryText);
console.log(result); // { hello: "Hello, World!", answer: 42 }
```

### Parse JSON value

```function parseValue(valueText)```

```javascript
import {parseValue} from "@popovmp/request-parser";

const valueText = "42";
const result    = parseValue(valueText);
console.log(result); // 42
```
### Split Authorization Header

```function splitAuthToken(authorization, split, partsCount)```

```javascript
import {splitAuthToken} from "@popovmp/request-parser";

const authorization = "Bearer foo;bar;42";

const [header, payload, signature] = splitAuthToken(authorization, ";", 3);

console.log(header);    // "foo"
console.log(payload);   // "bar"
console.log(signature); // "42"
```
