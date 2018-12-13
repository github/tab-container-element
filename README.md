# &lt;tab-container&gt; element

A accessible tab container element with keyboard support. Follows the [ARIA best practices guide on tabs](https://www.w3.org/TR/wai-aria-practices/#tabpanel).

## Installation

```
$ npm install @github/tab-container-element
```

## Usage

```js
import '@github/tab-container-element'
```

```html
<tab-container>
  <div role="tablist">
    <button type="button" role="tab" aria-selected="true">Tab one</button>
    <button type="button" role="tab">Tab two</button>
    <button type="button" role="tab">Tab three</button>
  </div>
  <div role="tabpanel">
    Panel 1
  </div>
  <div role="tabpanel" hidden>
    Panel 2
  </div>
  <div role="tabpanel" hidden>
    Panel 3
  </div>
</tab-container>
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
