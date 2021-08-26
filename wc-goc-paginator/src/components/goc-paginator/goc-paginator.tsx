import { Component, Event, h, EventEmitter, Prop } from '@stencil/core';

@Component({
  tag: 'wc-goc-paginator',
  styleUrl: 'goc-paginator.scss',
  shadow: true,
})
export class GOCPaginator {
  @Prop() pageTitle = 'Items per page';
  @Prop() pageNumber: number = 1;
  @Prop() pageSize: number = 10;
  @Prop() sizeOptions: number[] = [10, 20, 50];
  @Prop() itemCount: number;

  @Event({ eventName: 'pageChanged', cancelable: true, bubbles: true }) pageChanged: EventEmitter;
  @Event() sizeChanged: EventEmitter;

  private pageCount: number = 0;

  private handlePrevious(event) {
    if (this.pageNumber !== 0) {
      this.handleSelect(event, this.pageNumber - 1)
    }
  }

  private handleNext(event) {
    if (this.pageNumber !== this.pageCount - 1) {
      this.handleSelect(event, this.pageNumber + 1);
    }
  }

  private handleSelect(event: UIEvent, index: number) {
    event.preventDefault();
    this.pageChanged.emit(index);
  }

  private handlePageSizeChange(event) {
    this.sizeChanged.emit(Number(event.currentTarget.value));
  }

  render() {
    const prev = '<'
    const next = '>'
    if (this.itemCount) {
      let pages = [];
      const start = this.pageNumber * this.pageSize + 1;
      const end = this.pageNumber * this.pageSize + this.pageSize;

      for (let i = 0; i < this.itemCount / this.pageSize; i++) {
        pages.push(i);
      }

      this.pageCount = pages.length;

      return (
        <div class="paginator">
          <span class="title">
            {this.pageTitle}
          </span>
          <span class="counts">
            {start} - {this.pageNumber === pages[pages.length - 1] ? this.itemCount : end} of {this.itemCount}
          </span>
          {
            this.sizeOptions.length
              ? <span class="size">
                <select onChange={event => this.handlePageSizeChange(event)}>
                  {
                    this.sizeOptions.map(n =>
                      <option>{n}</option>
                    )
                  }
                </select>
              </span>
              : <span></span>
          }

          <span class="pages">
            <span>
              <a
                class={this.pageNumber === 0 ? 'disabled' : ''}
                onClick={event => this.handlePrevious(event)}>
                {prev}
              </a>
            </span>
            <span>
              <a
                class={this.pageNumber === pages.length - 1 ? 'disabled' : ''}
                onClick={event => this.handleNext(event)}>
                {next}
              </a>
            </span>
          </span>
        </div>
      );
    }
  }
}

