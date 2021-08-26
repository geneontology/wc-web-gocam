

# GOC Paginator Component


## wc-goc-paginator

### Properties

| Property      | Attribute     | Description | Type       | Default            |
| ------------- | ------------- | ----------- | ---------- | ------------------ |
| `itemCount`   | `item-count`  |             | `number`   | `undefined`        |
| `pageNumber`  | `page-number` |             | `number`   | `1`                |
| `pageSize`    | `page-size`   |             | `number`   | `10`               |
| `pageTitle`   | `page-title`  |             | `string`   | `'Items per page'` |
| `sizeOptions` | --            |             | `number[]` | `[10, 20, 50]`     |


### Events

| Event         | Description | Type               |
| ------------- | ----------- | ------------------ |
| `pageChanged` |             | `CustomEvent<any>` |
| `sizeChanged` |             | `CustomEvent<any>` |


----------------------------------------------
