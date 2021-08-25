# wc-goc-paginator

Multi purpose pagination tool


## Properties

| Property      | Attribute      | Description | Type       | Default          |
| ------------- | -------------- | ----------- | ---------- | ---------------- |
| `itemCount`   | `item-count`   |             | `number`   | '0'              |
| `page`        | `page`         |             | `number`   | `0`              |
| `pageSize`    | `page-size`    |             | `number`   | `10`             |
| `sizeOptions` | `size-options` |             | `number[]` | `[10, 20, 50]`   |
| `title`       | `title`        |             | `string`   | `Items per page` |


## Events

| Event         | Description | Type               |
| ------------- | ----------- | ------------------ |
| `pageChanged` |             | `CustomEvent<any>` |
| `sizeChanged` |             | `CustomEvent<any>` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
