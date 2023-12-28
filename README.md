# csv2json

[![Package Version](https://badgen.net/npm/v/csv2json)](https://npmjs.org/package/csv2json) [![Build Status](https://travis-ci.org/julien-f/csv2json.png?branch=master)](https://travis-ci.org/julien-f/csv2json) [![PackagePhobia](https://badgen.net/packagephobia/install/csv2json)](https://packagephobia.now.sh/result?p=csv2json) [![Latest Commit](https://badgen.net/github/last-commit/julien-f/csv2json)](https://github.com/julien-f/csv2json/commits/master)

**Looking for maintainers, drop a message [in this issue](https://github.com/julien-f/csv2json/issues/36).**

> Stream and CLI to convert CSV to JSON.

## Install

Installation of the [npm package](https://npmjs.org/package/csv2json):

Install globally if you want to use the CLI:

```
npm install --global csv2json
```

Install locally if you want to use it as a library:

```
npm install --save csv2json
```

## Usage

### Json Object

```javascript
var csv2json = require("csvtojson-parser");
var fs = require("fs");
csv2json("example.csv", options, function (err, jsonData) {
    if (err) {
        console.error("Error:", err);
    } else {
        result = jsonData;
        console.log(JSON.stringify(jsonData, null, 2));
    }
});
```

## Contributions

Contributions are _very_ welcomed, either on the documentation or on
the code.

You may:

-   report any [issue](https://github.com/kunalburangi/csv2json/issues)
    you've encountered;
-   fork and create a pull request.

## Note

Thanks to @twilson63 for letting me use the _csv2json_ name on [npm](https://www.npmjs.org/).

## License

[Kunal Burangi]
