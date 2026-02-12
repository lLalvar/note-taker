#!/usr/bin/env node

/* eslint-disable no-undef */
const fs = require('fs')
const path = require('path')

const ROOT_DIR = path.join(__dirname, '..')
const TERMS_SOURCE_PATH = path.join(ROOT_DIR, 'lib', 'legal', 'terms.ts')
const PRIVACY_SOURCE_PATH = path.join(ROOT_DIR, 'lib', 'legal', 'privacy.ts')
const TERMS_OUTPUT_PATH = path.join(
  ROOT_DIR,
  'legal-site',
  'terms',
  'index.html'
)
const PRIVACY_OUTPUT_PATH = path.join(
  ROOT_DIR,
  'legal-site',
  'privacy',
  'index.html'
)
const ROBOTS_PATH = path.join(ROOT_DIR, 'legal-site', 'robots.txt')
const SITEMAP_PATH = path.join(ROOT_DIR, 'legal-site', 'sitemap.xml')

// Base URL for canonical, og:url, sitemap. Override with LEGAL_SITE_URL if needed.
const SITE_URL = (
  process.env.LEGAL_SITE_URL || 'https://dailymood-journal.vercel.app'
).replace(/\/$/, '')

function escapeHtml(value) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8')
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content)
}

function extractStringConst(source, constName) {
  const match = source.match(
    new RegExp(`export const ${constName} = ['"]([^'"]+)['"]`)
  )
  if (!match) {
    throw new Error(`Could not find ${constName}`)
  }
  return match[1]
}

function findMatchingBracket(input, startIndex, openChar, closeChar) {
  let depth = 0
  let stringQuote = null
  let isEscaped = false

  for (let i = startIndex; i < input.length; i += 1) {
    const char = input[i]
    if (stringQuote) {
      if (isEscaped) {
        isEscaped = false
      } else if (char === '\\') {
        isEscaped = true
      } else if (char === stringQuote) {
        stringQuote = null
      }
      continue
    }

    if (char === "'" || char === '"' || char === '`') {
      stringQuote = char
      continue
    }

    if (char === openChar) {
      depth += 1
    } else if (char === closeChar) {
      depth -= 1
      if (depth === 0) {
        return i
      }
    }
  }

  throw new Error(`Unbalanced ${openChar}${closeChar} in source`)
}

function extractArrayLiteral(source, constName) {
  const declarationRegex = new RegExp(
    `export const ${constName}(?:\\s*:[^=]+)?\\s*=`
  )
  const declarationMatch = declarationRegex.exec(source)
  if (!declarationMatch || declarationMatch.index === undefined) {
    throw new Error(`Could not find ${constName} declaration`)
  }
  const markerIndex = declarationMatch.index
  const equalsIndex = markerIndex + declarationMatch[0].length - 1

  const openBracketIndex = source.indexOf('[', equalsIndex)
  if (openBracketIndex === -1) {
    throw new Error(`Could not find array literal for ${constName}`)
  }

  const closeBracketIndex = findMatchingBracket(
    source,
    openBracketIndex,
    '[',
    ']'
  )

  return source.slice(openBracketIndex, closeBracketIndex + 1)
}

function parseTemplateStrings(arrayLiteral, interpolationMap) {
  const values = []
  const regex = /`([\s\S]*?)`/g
  let match = regex.exec(arrayLiteral)

  while (match) {
    let text = match[1]
    text = text.replace(/\$\{([A-Z_]+)\}/g, (_, variableName) => {
      if (!(variableName in interpolationMap)) {
        throw new Error(`Unknown template variable: ${variableName}`)
      }
      return interpolationMap[variableName]
    })
    values.push(text)
    match = regex.exec(arrayLiteral)
  }

  return values
}

function parseSections(source, sectionConstName, interpolationMap) {
  const sectionArrayLiteral = extractArrayLiteral(source, sectionConstName)
  const sections = []
  const sectionPattern =
    /\{\s*id:\s*'([^']+)',\s*title:\s*'([^']+)',\s*paragraphs:\s*\[([\s\S]*?)\],\s*\}/g
  let match = sectionPattern.exec(sectionArrayLiteral)

  while (match) {
    sections.push({
      id: match[1],
      title: match[2],
      paragraphs: parseTemplateStrings(match[3], interpolationMap),
    })
    match = sectionPattern.exec(sectionArrayLiteral)
  }

  if (!sections.length) {
    throw new Error(`No legal sections found in ${sectionConstName}`)
  }

  return sections
}

function renderParagraphs(paragraphs) {
  const output = []
  let listItems = []

  const flushList = () => {
    if (!listItems.length) return
    output.push('<ul>')
    for (const item of listItems) {
      output.push(`        <li>${escapeHtml(item)}</li>`)
    }
    output.push('      </ul>')
    listItems = []
  }

  for (const paragraph of paragraphs) {
    if (paragraph.startsWith('- ')) {
      listItems.push(paragraph.slice(2).trim())
      continue
    }

    flushList()
    output.push(`      <p>${escapeHtml(paragraph)}</p>`)
  }

  flushList()
  return output.join('\n')
}

function renderLegalPage({
  pageTitle,
  subtitle,
  lastUpdated,
  description,
  canonicalPath,
  sections,
  assetPrefix,
  homeHref,
  privacyHref,
  termsHref,
}) {
  const sectionHtml = sections
    .map((section) => {
      const paragraphHtml = renderParagraphs(section.paragraphs)
      return [
        `      <section id="${escapeHtml(section.id)}">`,
        `      <h2>${escapeHtml(section.title)}</h2>`,
        paragraphHtml,
        '      </section>',
      ].join('\n')
    })
    .join('\n\n')

  const canonicalUrl = SITE_URL ? `${SITE_URL}${canonicalPath}` : ''
  const ogImageUrl = SITE_URL ? `${SITE_URL}/icon.png` : ''
  const metaDescription = escapeHtml(description)
  const metaTitle = `DailyMood Journal - ${pageTitle}`

  const seoMeta = [
    `<meta name="description" content="${metaDescription}" />`,
    canonicalUrl
      ? `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`
      : '',
    canonicalUrl
      ? `<meta property="og:url" content="${escapeHtml(canonicalUrl)}" />`
      : '',
    `<meta property="og:title" content="${escapeHtml(metaTitle)}" />`,
    `<meta property="og:description" content="${metaDescription}" />`,
    `<meta property="og:type" content="website" />`,
    ogImageUrl
      ? `<meta property="og:image" content="${escapeHtml(ogImageUrl)}" />`
      : '',
    `<meta name="twitter:card" content="summary" />`,
    `<meta name="twitter:title" content="${escapeHtml(metaTitle)}" />`,
    `<meta name="twitter:description" content="${metaDescription}" />`,
  ]
    .filter(Boolean)
    .join('\n  ')

  return `<!doctype html>
<html lang="en">

<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(metaTitle)}</title>
  <meta name="robots" content="index,follow" />
  ${seoMeta}
  <link rel="icon" href="${escapeHtml(assetPrefix)}favicon.ico" type="image/x-icon" />
  <link rel="stylesheet" href="${escapeHtml(assetPrefix)}styles.css" />
</head>

<body>
  <div class="wrap">
    <header>
      <div class="app">
        <img src="${escapeHtml(assetPrefix)}icon.png" alt="" class="app-icon" width="40" height="40" />
        <div class="app-text">
          <strong>DailyMood Journal</strong>
          <span>${escapeHtml(subtitle)}</span>
        </div>
      </div>
      <nav>
        <a href="${escapeHtml(homeHref)}">Home</a>
        <a href="${escapeHtml(privacyHref)}">Privacy Policy</a>
        <a href="${escapeHtml(termsHref)}">Terms of Service</a>
      </nav>
    </header>

    <main>
      <h1>${escapeHtml(pageTitle)}</h1>
      <p class="meta">Last updated: ${escapeHtml(lastUpdated)}</p>

${sectionHtml}
    </main>

    <footer>© DailyMood Journal</footer>
  </div>
</body>

</html>
`
}

function generateLegalSite() {
  const termsSource = readFile(TERMS_SOURCE_PATH)
  const privacySource = readFile(PRIVACY_SOURCE_PATH)
  const legalContactEmail = extractStringConst(
    termsSource,
    'LEGAL_CONTACT_EMAIL'
  )

  const interpolationMap = {
    LEGAL_CONTACT_EMAIL: legalContactEmail,
  }

  const termsLastUpdated = extractStringConst(termsSource, 'TERMS_LAST_UPDATED')
  const privacyLastUpdated = extractStringConst(
    privacySource,
    'PRIVACY_LAST_UPDATED'
  )

  const termsSections = parseSections(
    termsSource,
    'TERMS_OF_SERVICE',
    interpolationMap
  )
  const privacySections = parseSections(
    privacySource,
    'PRIVACY_POLICY',
    interpolationMap
  )

  const termsHtml = renderLegalPage({
    pageTitle: 'Terms of Service',
    subtitle: 'Terms of Service',
    lastUpdated: termsLastUpdated,
    description:
      'Terms of Service for DailyMood Journal. Read the terms governing your use of the app and related services.',
    canonicalPath: '/terms/',
    sections: termsSections,
    assetPrefix: '../',
    homeHref: '../',
    privacyHref: '../privacy/',
    termsHref: '../terms/',
  })

  const privacyHtml = renderLegalPage({
    pageTitle: 'Privacy Policy',
    subtitle: 'Privacy Policy',
    lastUpdated: privacyLastUpdated,
    description:
      'Privacy Policy for DailyMood Journal. How we collect, use, and protect your data when you use the app.',
    canonicalPath: '/privacy/',
    sections: privacySections,
    assetPrefix: '../',
    homeHref: '../',
    privacyHref: '../privacy/',
    termsHref: '../terms/',
  })

  writeFile(TERMS_OUTPUT_PATH, termsHtml)
  writeFile(PRIVACY_OUTPUT_PATH, privacyHtml)

  // Sitemap (absolute URLs only when SITE_URL is set)
  if (SITE_URL) {
    const today = new Date().toISOString().slice(0, 10)
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${SITE_URL}/privacy/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${SITE_URL}/terms/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
`
    writeFile(SITEMAP_PATH, sitemap)
    const robotsContent = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`
    writeFile(ROBOTS_PATH, robotsContent)
  }
}

try {
  generateLegalSite()
  console.log('✅ legal-site pages generated from lib/legal source files')
} catch (error) {
  console.error(`❌ Failed to generate legal-site pages: ${error.message}`)
  process.exit(1)
}
