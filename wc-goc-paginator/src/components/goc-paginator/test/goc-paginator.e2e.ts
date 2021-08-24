import { newE2EPage } from '@stencil/core/testing';

describe('goc-paginator', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<goc-paginator></goc-paginator>');

    const element = await page.find('goc-paginator');
    expect(element).toHaveClass('hydrated');
  });
});
