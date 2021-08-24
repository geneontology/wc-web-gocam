import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'goc-paginator',
  styleUrl: 'goc-paginator.css',
  shadow: true,
})
export class GocPaginator {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
