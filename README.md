# &lt;tab-container&gt; element

A accessible tab container element with keyboard support. Follows the [ARIA best practices guide on tabs](https://www.w3.org/WAI/ARIA/apg/patterns/tabpanel/).

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
  <button type="button" id="tab-one" role="tab" aria-selected="true">Tab one</button>
  <button type="button" id="tab-two" role="tab" tabindex="-1">Tab two</button>
  <button type="button" id="tab-three" role="tab" tabindex="-1">Tab three</button>
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

If none of the tabs have `aria-selected=true`, then the first tab will be selected automatically. You can also add the `default-tab=N` attribute to avoid having to set `aria-selected=true` on the desired tab, where `N` is the 0-based tab index:

```html
<!-- The _second_ tab will be selected -->
<tab-container default-tab="1">
  <button type="button" id="tab-one" role="tab">Tab one</button>
  <button type="button" id="tab-two" role="tab">Tab two</button>
  <button type="button" id="tab-three" role="tab">Tab three</button>
  <!-- ... -->
</tab-container>

### Events

- `tab-container-change` (bubbles, cancelable): fired on `<tab-container>` before a new tab is selected and visibility is updated. `event.tab` is the tab that will be focused, `event.tabIndex` is the 0-based index of the `tab` and `tab.panel` is the panel that will be shown if the event isn't cancelled.
- `tab-container-changed` (bubbles): fired on `<tab-container>` after a new tab is selected and visibility is updated. `event.tab` is the tab that is now active (and will be focused right after this event), `event.tabIndex` is the 0-based index of the `tab` and `event.panel` is the newly visible tab panel.

### Parts

- `::part(tablist-wrapper)` is the wrapper which contains `before-tabs`, `tablist` and `after-tabs`.
- `::part(tablist)` is the container which wraps all tabs. This element appears in ATs as it is `role=tablist`.
- `::part(panel)` is the container housing the currently active tabpanel.
- `::part(before-tabs)` is the container housing any elements that appear before the first `role=tab`. This also can be directly slotted with `slot=before-tabs`. This container lives outside the element with role=tablist to adhere to ARIA guidelines.
- `::part(after-tabs)` is the container housing any elements that appear after the last `role=tab`. This also can be directly slotted with `slot=after-tabs`. This container lives outside the element with role=tablist to adhere to ARIA guidelines.
- `::part(after-panels)` is the container housing any elements that appear after the last `role=tabpanel`. This can be useful if you want to add a visual treatment to the container but have content always appear visually below the active panel.


### When tab panel contents are controls

When activated, the whole tab panel will receive focus. This may be undesirable, in the case where the tab panel is itself composed of interactive elements, such as an action list or radio buttons.

In those cases, apply `data-tab-container-no-tabstop` to the `tabpanel` element.

```html
<tab-container>
  <button type="button" id="tab-one" role="tab" aria-selected="true">Tab one</button>
  <button type="button" id="tab-two" role="tab" tabindex="-1">Tab two</button>
  <div role="tabpanel" aria-labelledby="tab-one" data-tab-container-no-tabstop>
    <ul role="menu" aria-label="Branches">
      <li tabindex="0">branch-one</li>
      <li tabindex="0">branch-two</li>
    </ul>
  </div>
  <div role="tabpanel" aria-labelledby="tab-two" data-tab-container-no-tabstop hidden>
    <ul role="menu" aria-label="Commits">
      <li tabindex="0">Commit One</li>
      <li tabindex="0">Commit Two</li>
    </ul>
  </div>
</tab-container>
```

### Vertical tabs

If `<tab-container>` is given the `vertical` attribute it will apply the `aria-orientation=vertical` attribute to the tablist. This will present to ATs as a vertical tablist, and you can use the attribute to style the tabs accordingly.

In those cases, apply `data-tab-container-no-tabstop` to the `tabpanel` element.

```html
<tab-container vertical>
  <button type="button" id="tab-one" role="tab" aria-selected="true">Tab one</button>
  <button type="button" id="tab-two" role="tab" tabindex="-1">Tab two</button>
  <div role="tabpanel" aria-labelledby="tab-one" data-tab-container-no-tabstop>
    <ul role="menu" aria-label="Branches">
      <li tabindex="0">branch-one</li>
      <li tabindex="0">branch-two</li>
    </ul>
  </div>
  <div role="tabpanel" aria-labelledby="tab-two" data-tab-container-no-tabstop hidden>
    <ul role="menu" aria-label="Commits">
      <li tabindex="0">Commit One</li>
      <li tabindex="0">Commit Two</li>
    </ul>
  </div>
</tab-container>
```

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
