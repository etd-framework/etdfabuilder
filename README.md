# etdfabuilder

Library to create custom build of FontAwesome 5.0

Add as dev dependencies :

```json
{
  "devDependencies": {
    "etdfabuilder": "git+ssh://git@github.com:etd-framework/etdfabuilder.git#0.0.3"
  }
}
```

```bash
yarn install
```

To choose the icons to include in your bundle, add the following to `package.json` :

```json
{
  "etdfabuilder": {
    "free-brands": [
      "facebook",
      "github",
      "viadeo",
      "linkedin"
    ],
    "pro-regular": [
      "archive"
    ]
  }
}
```

## CLI

```bash
etdfabuilder --output my-bundle.js
```
