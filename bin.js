#!/usr/bin/env node

import url from 'url';
import { createRunner, PuppeteerRunnerExtension } from '@puppeteer/replay';
import puppeteer from 'puppeteer';

export async function run(extension) {
    const browser = await puppeteer.launch({
      headless: !process.env.DISPLAY,
    });

    const page = await browser.newPage();

    class Extension extends PuppeteerRunnerExtension {
      async beforeAllSteps(flow) {
        await super.beforeAllSteps(flow);
        console.log('starting');
      }

      async beforeEachStep(step, flow) {
        await super.beforeEachStep(step, flow);
        console.log('before', step);
      }

      async afterEachStep(step, flow) {
        await super.afterEachStep(step, flow);
        console.log('after', step);
      }

      async afterAllSteps(flow) {
        await super.afterAllSteps(flow);
        console.log('done');
        await browser.close()
      }
    }

    const runner = await createRunner(new Extension(browser, page, 7000));

    await runner.runBeforeAllSteps();

    await runner.runStep({
        type: 'setViewport',
        width: 1488,
        height: 245,
        deviceScaleFactor: 1,
        isMobile: false,
        hasTouch: false,
        isLandscape: false
    });
    await runner.runStep({
        type: 'navigate',
        url: 'http://quadrings.iot.realraum.at/settings/leds',
        assertedEvents: [
            {
                type: 'navigation',
                url: 'http://quadrings.iot.realraum.at/settings/leds',
                title: 'LED Settings'
            }
        ]
    });

    await new Promise((resolve) => setTimeout(resolve, 3000))

    await runner.runStep({
        type: 'click',
        target: 'main',
        selectors: [
            [
                '#form_s'
            ],
            [
                'xpath///*[@id="form_s"]'
            ],
            [
                'pierce/#form_s'
            ]
        ],
        offsetY: 2359,
        offsetX: 423,
    });
    /*await runner.runStep({
        type: 'keyDown',
        target: 'main',
        key: 'Control'
    });
    await runner.runStep({
        type: 'keyDown',
        target: 'main',
        key: 'f'
    });
    await runner.runStep({
        type: 'doubleClick',
        target: 'main',
        selectors: [
            [
                'input:nth-of-type(15)'
            ],
            [
                'xpath///*[@id="form_s"]/input[15]'
            ],
            [
                'pierce/input:nth-of-type(15)'
            ]
        ],
        offsetY: 10.296875,
        offsetX: 20.8671875,
    });*/
    await runner.runStep({
        type: 'change',
        value: process.argv.pop(),
        selectors: [
            [
                'input:nth-of-type(15)'
            ],
            [
                'xpath///*[@id="form_s"]/input[15]'
            ],
            [
                'pierce/input:nth-of-type(15)'
            ]
        ],
        target: 'main'
    });
    await runner.runStep({
        type: 'click',
        target: 'main',
        selectors: [
            [
                'button:nth-of-type(4)'
            ],
            [
                'xpath///*[@id="form_s"]/button[4]'
            ],
            [
                'pierce/button:nth-of-type(4)'
            ]
        ],
        offsetY: 25.546875,
        offsetX: 18.3359375,
        assertedEvents: [
            {
                type: 'navigation',
                url: 'http://quadrings.iot.realraum.at/settings/leds',
                title: ''
            }
        ]
    });

    await runner.runAfterAllSteps();
}

if (process && import.meta.url === url.pathToFileURL(process.argv[1]).href) {
    run()
}

