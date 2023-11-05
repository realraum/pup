import {AssertedEventType, createRunner, PuppeteerRunnerExtension, Step, StepType, UserFlow} from '@puppeteer/replay'
import puppeteer, {Page} from 'puppeteer'

const browser = await puppeteer.launch({
  headless: !process.env.DISPLAY,
})

class Extension extends PuppeteerRunnerExtension {
  async beforeAllSteps(flow?: UserFlow) {
    await super.beforeAllSteps!(flow)
  }

  async beforeEachStep(step: Step, flow?: UserFlow) {
    await super.beforeEachStep!(step, flow)
  }

  async afterEachStep(step: Step, flow?: UserFlow) {
    await super.afterEachStep!(step, flow)
  }

  async afterAllSteps(flow?: UserFlow) {
    await super.afterAllSteps!(flow)
    await this.page.close()
  }
}

export function buildUrl(host: string, suburl: string) {
  return `http://${host}.iot.realraum.at${suburl}`
}

export async function fetchAPI(host: string, suburl: string) {
  const url = buildUrl(host, suburl)
  const req = await fetch(url, {
    "headers": {
      "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
      "accept-language": "de,pl;q=0.9,en;q=0.8,en-US;q=0.7,de-DE;q=0.6",
      "cache-control": "no-cache",
      "pragma": "no-cache",
      "sec-gpc": "1",
      "upgrade-insecure-requests": "1",
      "Referer": url,
      "Referrer-Policy": "strict-origin-when-cross-origin"
    }
  })
  return await req.text()
}

export async function pupeteerAPI(host: string, suburl: string, executor: (runner: Awaited<ReturnType<typeof createRunner>>, page: Page, url: string) => Promise<void>) {
  const page = await browser.newPage()
  const url = buildUrl(host, suburl)

  const runner = await createRunner(new Extension(browser, page, { timeout: 7000 }))

  await runner.runBeforeAllSteps()

  await runner.runStep({
    type: StepType.Navigate,
    url,
    assertedEvents: [
      {
        type: AssertedEventType.Navigation,
        url
      }
    ]
  })

  await executor(runner, page, url)

  await runner.runAfterAllSteps()
}
