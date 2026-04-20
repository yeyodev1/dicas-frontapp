import { useHead } from '@unhead/vue'

const BASE_URL = 'https://dicasadvisor.org'
const SITE_NAME = 'Dicas Advisor Group'
const DEFAULT_IMAGE = `${BASE_URL}/og-image.jpg`

interface SEOOptions {
  title: string
  description: string
  path?: string
  image?: string
  type?: 'website' | 'article'
  noIndex?: boolean
}

export function useSEO(options: SEOOptions) {
  const {
    title,
    description,
    path = '/',
    image = DEFAULT_IMAGE,
    type = 'website',
    noIndex = false,
  } = options

  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`
  const canonical = `${BASE_URL}${path}`

  useHead({
    title: fullTitle,
    meta: [
      { name: 'description', content: description },
      { name: 'robots', content: noIndex ? 'noindex,nofollow' : 'index,follow' },

      // Open Graph
      { property: 'og:title', content: fullTitle },
      { property: 'og:description', content: description },
      { property: 'og:url', content: canonical },
      { property: 'og:image', content: image },
      { property: 'og:image:width', content: '1200' },
      { property: 'og:image:height', content: '630' },
      { property: 'og:type', content: type },
      { property: 'og:site_name', content: SITE_NAME },
      { property: 'og:locale', content: 'es_US' },

      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: fullTitle },
      { name: 'twitter:description', content: description },
      { name: 'twitter:image', content: image },
    ],
    link: [
      { rel: 'canonical', href: canonical },
    ],
  })
}
