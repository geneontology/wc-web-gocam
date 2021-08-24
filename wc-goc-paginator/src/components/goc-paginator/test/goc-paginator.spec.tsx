import { newSpecPage } from '@stencil/core/testing';
import { GocPaginator } from '../goc-paginator';

describe('goc-paginator', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [GocPaginator],
      html: `<goc-paginator></goc-paginator>`,
    });
    expect(page.root).toEqualHtml(`
      <goc-paginator>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </goc-paginator>
    `);
  });
});
