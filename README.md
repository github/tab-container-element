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
    <button type="button" id="tab-one" role="tab" aria-selected="true">Tab one</button>
    <button type="button" id="tab-two" role="tab" tabindex="-1">Tab two</button>
    <button type="button" id="tab-three" role="tab" tabindex="-1">Tab three</button>
  </div>
  <div role="tabpanel" aria-labelledby="tab-one">
    Panel 1
  </div>
  <div role="tabpanel" aria-labelledby="tab-two" hidden>
    Panel 2
  </div>
  <div role="tabpanel" aria-labelledby="tab-three" hidden>
    Panel 3
  </div>
</tab-container>
```

### Events

- `tab-container-change` (bubbles, cancelable): fired on `<tab-container>` before a new tab is selected and visibility is updated. `event.detail.relatedTarget` is the tab panel that will be selected if the event isn't cancelled.
- `tab-container-changed` (bubbles): fired on `<tab-container>` after a new tab is selected and visibility is updated. `event.detail.relatedTarget` is the newly visible tab panel.

## Browser support

Browsers without native [custom element support][support] require a [polyfill][].

- Chrome
- Firefox
- Safari
- Microsoft Edge

[support]: https://caniuse.com/#feat=custom-elementsv1
[polyfill]: https://github.com/webcomponents/polyfills/tree/master/packages/custom-elements

## Development

```
npm install
npm test
```

## License

Distributed under the MIT license. See LICENSE for details.
