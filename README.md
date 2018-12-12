# &lt;tab-container&gt; element

A accessible tab container element with keyboard support.

Tries to follow the [ARIA best practices guide on tabs](https://www.w3.org/TR/wai-aria-practices/#tabpanel).

## Installation

```
$ npm install @github/tab-container-element
```

## Usage

```js
import '@github/tab-container-element'
```

```html
<tab-container></tab-container>
```

## Browser support

Browsers without native [custom element support][support] require a [polyfill][].

- Chrome
- Firefox
- Safari
- Internet Explorer 11
- Microsoft Edge

[support]: https://caniuse.com/#feat=custom-elementsv1
[polyfill]: https://github.com/webcomponents/custom-elements

## Development

```
npm install
npm test
```

## License

Distributed under the MIT license. See LICENSE for details.
