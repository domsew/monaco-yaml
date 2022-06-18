import { promises as fs } from 'fs';

import libCoverage from 'istanbul-lib-coverage';
import libReport from 'istanbul-lib-report';
import reports from 'istanbul-reports';
import v8toIstanbul from 'v8-to-istanbul';

import { type Page } from '@playwright/test';

export async function saveV8Coverage(page: Page): Promise<void> {
  const coverage = await page.coverage.stopJSCoverage();
  const map = libCoverage.createCoverageMap();
  for (const entry of coverage) {
    if (entry.url === '') {
      continue;
    }
    // `test/${entry.scriptId}.js`
    const scriptPath = `test${new URL(entry.url).pathname}`;
    const converter = v8toIstanbul(scriptPath, 0, { source: entry.source }, (filepath) => {
      const normalized = filepath.replace(/\\/g, '/');
      const ret = normalized.includes('node_modules/');
      return ret;
    });
    await converter.load();
    converter.applyCoverage(entry.functions);
    const data = converter.toIstanbul();
    map.merge(data);
  }
  await fs.rm('coverage', { force: true, recursive: true });
  const context = libReport.createContext({ coverageMap: map });
  reports.create('html').execute(context);
}

export async function saveIstanbulCoverage(page: Page): Promise<void> {
  const coverage = await page.evaluate(
    // eslint-disable-next-line no-underscore-dangle, @typescript-eslint/naming-convention
    () => (window as unknown as { __coverage__: libCoverage.CoverageMapData }).__coverage__,
  );
  await fs.rm('coverage', { force: true, recursive: true });
  const context = libReport.createContext({ coverageMap: libCoverage.createCoverageMap(coverage) });
  reports.create('html').execute(context);
  await fs.writeFile('coverage/coverage.json', JSON.stringify(coverage));
}
