import { generateHtml, generateHtmlWithLoader } from '../html';

describe('generateHtml (bare shell — bridge mode)', () => {
  it('generates valid HTML with no script tag and no __wafLoadScript', () => {
    const html = generateHtml();
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).not.toMatch(/<script\s+src=/);
    expect(html).not.toContain('__wafLoadScript');
  });

  it('includes message handler (addEventListener)', () => {
    const html = generateHtml();
    expect(html).toContain("window.addEventListener('message', handleCommand)");
  });

  it('includes waitForWaf function definition', () => {
    const html = generateHtml();
    expect(html).toContain('function waitForWaf');
  });

  it('includes error handler (window.onerror)', () => {
    const html = generateHtml();
    expect(html).toContain('window.onerror');
  });

  it('includes Android compat listener (document.addEventListener)', () => {
    const html = generateHtml();
    expect(html).toContain("document.addEventListener('message', handleCommand)");
  });

  it('posts shell_ready on load', () => {
    const html = generateHtml();
    expect(html).toContain('shell_ready');
  });
});

describe('generateHtmlWithLoader (html mode)', () => {
  it('includes __wafLoadScript for dynamic script injection', () => {
    const html = generateHtmlWithLoader();
    expect(html).toContain('window.__wafLoadScript');
    expect(html).toContain("document.createElement('script')");
  });

  it('includes waitForWaf call inside __wafLoadScript', () => {
    const html = generateHtmlWithLoader();
    expect(html).toContain('waitForWaf(25)');
  });

  it('includes bridge handler and shell_ready', () => {
    const html = generateHtmlWithLoader();
    expect(html).toContain("window.addEventListener('message', handleCommand)");
    expect(html).toContain('shell_ready');
  });

  it('has no script src tag in head', () => {
    const html = generateHtmlWithLoader();
    expect(html).not.toMatch(/<script\s+src=/);
  });
});
