import {fetchAPI, pupeteerAPI} from "./client"
import {AssertedEventType, StepType} from "@puppeteer/replay";
import Boom from "@hapi/boom";

function commonWaitLoaded() {

}

const PageIdRegex = /getURL\("(\/settings\/s\.js\?p=\d+)"\)/
const SettingsPageRegex = /getURL\("\/settings\/([a-z]+)"\)/gm

export async function getSettingsPages(host: string) {
  const settingsPage = await fetchAPI(host, '/settings')

  let pages: string[] = []

  for (const match of settingsPage.matchAll(SettingsPageRegex)) {
    pages.push(match[1])
  }

  return pages
}

export async function verifySettingsPage(host: string, page: string) {
  const pages = await getSettingsPages(host)
  if (pages.indexOf(page) === -1) {
    throw Boom.badRequest('Invalid page ' + page)
  }
}

export async function getSettingsValues(host: string, page: string) {
  const htmlOfSettings = await fetchAPI(host, '/settings/' + page)
  const pageId = htmlOfSettings.match(PageIdRegex)
  if (!pageId) throw new Error('Could not find pageId')
  const id = pageId[1]

  return await fetchAPI(host, id)
}

export async function setSettingsValue(host: string, page: string, key: string, value: string) {
  await pupeteerAPI(host, '/settings/' + page, async (runner, page, url) => {
    await runner.runStep({
      type: StepType.Change,
      value: value,
      selectors: [
        [
          'input[name='+JSON.stringify(key)+']'
        ]
      ],
      target: 'main'
    })

    await runner.runStep({
      type: StepType.Click,
      target: 'main',
      selectors: [
        [
          'button[type="submit"]'
        ]
      ],
      offsetY: 27.046875,
      offsetX: 44.3359375,
      assertedEvents: [
        {
          type: AssertedEventType.Navigation,
          url: url
        }
      ]
    })
  })
}
