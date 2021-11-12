# File Wrap Loader

> File wrapper loader for Webpack

## Install

```bash
npm install file-wrap-loader
```

## Usage

```js
module.exports = {
  //...
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'file-wrap-loader',
      options: {
        template: '/*library: test*/export default function(){<%= content %>}' // template compiler use lodash template
      }
    }]
  }
}
```
