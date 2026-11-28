import { fetchFirestoreCollection } from '../utils/firestore'

interface SitemapEntry {
  loc: string
  lastmod?: string
  changefreq?: string
  priority?: string
}

function hasPtContent(doc: Record<string, any>): boolean {
  return Boolean(doc?.titulo?.trim() || doc?.conteudo?.trim() || doc?.descricao?.trim())
}

function hasEnContent(doc: Record<string, any>): boolean {
  const tr = doc?.translations?.['en-US']
  return Boolean(tr && (tr.titulo?.trim() || tr.conteudo?.trim() || tr.descricao?.trim()))
}

function formatLastMod(value: unknown): string | undefined {
  if (!value || typeof value !== 'string') return undefined
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return undefined
  return date.toISOString()
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export default defineCachedEventHandler(
  async (event) => {
    const baseUrl = (process.env.NUXT_PUBLIC_SITE_URL || 'https://vivaabiblia.com.br').replace(/\/$/, '')

    const [devocionais, estudos, artigos, materiais] = await Promise.all([
      fetchFirestoreCollection('devocionais'),
      fetchFirestoreCollection('estudos'),
      fetchFirestoreCollection('artigos'),
      fetchFirestoreCollection('materiais'),
    ])

    const entries: SitemapEntry[] = [
      { loc: `${baseUrl}/`, changefreq: 'daily', priority: '1.0' },
      { loc: `${baseUrl}/en`, changefreq: 'daily', priority: '1.0' },
      { loc: `${baseUrl}/devocionais`, changefreq: 'daily', priority: '0.9' },
      { loc: `${baseUrl}/en/devotionals`, changefreq: 'daily', priority: '0.9' },
      { loc: `${baseUrl}/sobre`, changefreq: 'monthly', priority: '0.6' },
      { loc: `${baseUrl}/en/about`, changefreq: 'monthly', priority: '0.6' },
      { loc: `${baseUrl}/politica-de-privacidade`, changefreq: 'yearly', priority: '0.4' },
      { loc: `${baseUrl}/en/privacy-policy`, changefreq: 'yearly', priority: '0.4' },
    ]

    if (process.env.PIX_KEY?.trim()) {
      entries.push(
        { loc: `${baseUrl}/doacoes`, changefreq: 'monthly', priority: '0.5' },
        { loc: `${baseUrl}/en/donations`, changefreq: 'monthly', priority: '0.5' }
      )
    }

    const activeMaterials = materiais.filter((m: any) => m.ativo !== false)
    if (activeMaterials.some(hasPtContent)) {
      entries.push({ loc: `${baseUrl}/materiais`, changefreq: 'weekly', priority: '0.7' })
    }
    if (activeMaterials.some(hasEnContent)) {
      entries.push({ loc: `${baseUrl}/en/materials`, changefreq: 'weekly', priority: '0.7' })
    }

    if (estudos.some(hasPtContent)) {
      entries.push({ loc: `${baseUrl}/estudos`, changefreq: 'weekly', priority: '0.8' })
    }
    if (estudos.some(hasEnContent)) {
      entries.push({ loc: `${baseUrl}/en/studies`, changefreq: 'weekly', priority: '0.8' })
    }

    if (artigos.some(hasPtContent)) {
      entries.push({ loc: `${baseUrl}/artigos`, changefreq: 'weekly', priority: '0.8' })
    }
    if (artigos.some(hasEnContent)) {
      entries.push({ loc: `${baseUrl}/en/articles`, changefreq: 'weekly', priority: '0.8' })
    }

    for (const dev of devocionais as Record<string, any>[]) {
      const lastmod = formatLastMod(dev.createdAt)
      if (hasPtContent(dev)) {
        entries.push({
          loc: `${baseUrl}/devocionais/${dev.id}`,
          lastmod,
          changefreq: 'monthly',
          priority: '0.8',
        })
      }
      if (hasEnContent(dev)) {
        entries.push({
          loc: `${baseUrl}/en/devotionals/${dev.id}`,
          lastmod,
          changefreq: 'monthly',
          priority: '0.8',
        })
      }
    }

    for (const est of estudos as Record<string, any>[]) {
      const lastmod = formatLastMod(est.createdAt)
      if (hasPtContent(est)) {
        entries.push({
          loc: `${baseUrl}/estudos/${est.id}`,
          lastmod,
          changefreq: 'monthly',
          priority: '0.8',
        })
      }
      if (hasEnContent(est)) {
        entries.push({
          loc: `${baseUrl}/en/studies/${est.id}`,
          lastmod,
          changefreq: 'monthly',
          priority: '0.8',
        })
      }
    }

    for (const art of artigos as Record<string, any>[]) {
      const lastmod = formatLastMod(art.createdAt)
      if (hasPtContent(art)) {
        entries.push({
          loc: `${baseUrl}/artigos/${art.id}`,
          lastmod,
          changefreq: 'monthly',
          priority: '0.8',
        })
      }
      if (hasEnContent(art)) {
        entries.push({
          loc: `${baseUrl}/en/articles/${art.id}`,
          lastmod,
          changefreq: 'monthly',
          priority: '0.8',
        })
      }
    }

    const xmlUrls = entries
      .map((entry) => {
        const lines = [
          `    <loc>${escapeXml(entry.loc)}</loc>`,
          entry.lastmod ? `    <lastmod>${entry.lastmod}</lastmod>` : '',
          entry.changefreq ? `    <changefreq>${entry.changefreq}</changefreq>` : '',
          entry.priority ? `    <priority>${entry.priority}</priority>` : '',
        ].filter(Boolean)
        return `  <url>\n${lines.join('\n')}\n  </url>`
      })
      .join('\n')

    setHeader(event, 'content-type', 'application/xml; charset=utf-8')
    return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${xmlUrls}\n</urlset>\n`
  },
  {
    maxAge: import.meta.dev ? 0 : 60 * 60,
    swr: !import.meta.dev,
    shouldBypassCache: () => import.meta.dev,
    name: 'sitemap-xml',
  }
)
