import ReactDOMServer from 'react-dom/server'
import React from 'react'
import logo from './icons/vite-plugin-ssr.svg'
import { html } from 'vite-plugin-ssr'
import { PageLayout } from './PageLayout'
import { Heading, headings as headings_static, parse } from '../headings'
import { assert, slice, jsxToTextContent } from '../utils'
import type { HeadingExtracted } from '../vite.config/vite-plugin-mdx-export-headings'

type ReactComponent = () => JSX.Element
declare global {
  interface ImportMeta {
    glob: (path: string) => Record<string, () => Promise<{ default: ReactComponent }>>
    globEager: (path: string) => Record<string, { default: ReactComponent }>
  }
}

export { render }

type PageExports = {
  headings?: HeadingExtracted[]
}
type PageContext = {
  url: string
  Page: ReactComponent
  PageContent: ReactComponent
  headings: Heading[]
  pageExports: PageExports
}
function render(pageContext: PageContext) {
  const { headings, activeHeading } = supplementHeadings(headings_static, pageContext)
  const { Page } = pageContext
  const page = (
    <PageLayout headings={headings} activeHeading={activeHeading}>
      <Page />
    </PageLayout>
  )
  const pageHtml = ReactDOMServer.renderToString(page)
  const isLandingPage = pageContext.url === '/'
  const desc = html.dangerouslySkipEscape(
    '<meta name="description" content="Like Next.js / Nuxt but as do-one-thing-do-it-well Vite plugin." />'
  )
  return html`<!DOCTYPE html>
    <html>
      <head>
        <link rel="icon" href="${logo}" />
        <title>${activeHeading.titleDocument || jsxToTextContent(activeHeading.title)}</title>
        ${isLandingPage ? desc : ''}
        <meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no" />
      </head>
      <body>
        <div id="page-view">${html.dangerouslySkipEscape(pageHtml)}</div>
      </body>
    </html>`
}

function supplementHeadings(
  headings_static: Heading[],
  pageContext: { url: string; pageExports: PageExports }
): { headings: Heading[]; activeHeading: Heading } {
  let activeHeadingIdx: number | undefined
  let activeHeading: Heading | undefined
  assert(pageContext.url)
  const headings_withoutPageHeadings = headings_static.map((heading, i) => {
    if (heading.url === pageContext.url) {
      assert(activeHeadingIdx === undefined)
      activeHeadingIdx = i
      activeHeading = heading
      assert(heading.level === 2)
      const heading_: Heading = { ...heading, isActive: true }
      return heading_
    }
    return heading
  })
  assert(typeof activeHeadingIdx === 'number')
  assert(activeHeading, { urls: headings_static.map((h) => h.url), url: pageContext.url })
  const pageHeadings = pageContext.pageExports.headings || []
  const headings: Heading[] = [
    ...slice(headings_withoutPageHeadings, 0, activeHeadingIdx + 1),
    ...pageHeadings.map((pageHeading) => {
      const title = parse(pageHeading.title)
      const url = '#' + pageHeading.id
      const heading: Heading = {
        url,
        title,
        level: 3
      }
      return heading
    }),
    ...slice(headings_withoutPageHeadings, activeHeadingIdx + 1, 0)
  ]
  assert(headings.length > 0)
  return { headings, activeHeading }
}
