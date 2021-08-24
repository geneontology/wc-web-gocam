import { newSpecPage } from '@stencil/core/testing';
import { CamTable } from './wc-gocam-table';

describe('wc-gocam-table', () => {
  it('renders', async () => {
    const { root } = await newSpecPage({
      components: [CamTable],
      html: '<wc-gocam-table></wc-gocam-table>',
    });
    expect(root).toEqualHtml(`
      <wc-gocam-table>
        <mock:shadow-root>
          <div>
            Hello, World! I'm
          </div>
        </mock:shadow-root>
      </wc-gocam-table>
    `);
  });

  it('renders with values', async () => {
    const { root } = await newSpecPage({
      components: [CamTable],
      html: `<wc-gocam-table first="Stencil" last="'Don't call me a framework' JS"></wc-gocam-table>`,
    });
    expect(root).toEqualHtml(`
      <wc-gocam-table first="Stencil" last="'Don't call me a framework' JS">
        <mock:shadow-root>
          <div>
            Hello, World! I'm Stencil 'Don't call me a framework' JS
          </div>
        </mock:shadow-root>
      </wc-gocam-table>
    `);
  });
});
