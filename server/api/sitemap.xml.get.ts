import { defineEventHandler, getHeader, setHeader } from 'h3'

export default defineEventHandler(async (event: any) => {
  const hostname = getHeader(event, 'host') || 'casadapedra.com.br'
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  const baseUrl = `${protocol}://${hostname}`

  // Simulate fetching tours and accommodations from API
  // In a real implementation, you would fetch from your actual API
  const tours = [
    {
      id: 'aluguel-buggy-buzios',
      title: 'Aluguel de Buggy em Búzios',
      slug: 'aluguel-buggy-buzios',
      lastmod: '2024-01-20',
      images: ['https://casadapedra.com.br/images/tours/buggy-buzios.jpg']
    },
    {
      id: 'passeio-barco-buzios',
      title: 'Passeio de Barco em Búzios',
      slug: 'passeio-barco-buzios',
      lastmod: '2024-01-20',
      images: ['https://casadapedra.com.br/images/tours/barco-buzios.jpg']
    },
    {
      id: 'trilha-pedra-bonita',
      title: 'Trilha da Pedra Bonita',
      slug: 'trilha-pedra-bonita',
      lastmod: '2024-01-20',
      images: ['https://casadapedra.com.br/images/tours/trilha-pedra-bonita.jpg']
    },
    {
      id: 'voo-livre-pedra-bonita',
      title: 'Voo Livre na Pedra Bonita',
      slug: 'voo-livre-pedra-bonita',
      lastmod: '2024-01-20',
      images: ['https://casadapedra.com.br/images/tours/voo-livre.jpg']
    },
    {
      id: 'trilha-pedra-da-gavea',
      title: 'Trilha da Pedra da Gávea',
      slug: 'trilha-pedra-da-gavea',
      lastmod: '2024-01-20',
      images: ['https://casadapedra.com.br/images/tours/pedra-gavea.jpg']
    }
  ]

  const accommodations = [
    {
      id: 'pousada-buzios-centro',
      title: 'Pousada Búzios Centro',
      slug: 'pousada-buzios-centro',
      lastmod: '2024-01-20',
      images: ['https://casadapedra.com.br/images/accommodations/pousada-buzios.jpg']
    },
    {
      id: 'hotel-arraial-do-cabo',
      title: 'Hotel Arraial do Cabo',
      slug: 'hotel-arraial-do-cabo',
      lastmod: '2024-01-20',
      images: ['https://casadapedra.com.br/images/accommodations/hotel-arraial.jpg']
    }
  ]

  // Static pages
  const staticPages = [
    { path: '', priority: '1.0', changefreq: 'daily' },
    { path: '/tours', priority: '0.9', changefreq: 'daily' },
    { path: '/accommodations', priority: '0.9', changefreq: 'daily' },
    { path: '/search', priority: '0.7', changefreq: 'daily' },
    { path: '/about', priority: '0.6', changefreq: 'monthly' },
    { path: '/contact', priority: '0.6', changefreq: 'monthly' },
    { path: '/blog', priority: '0.7', changefreq: 'weekly' },
    { path: '/terms', priority: '0.3', changefreq: 'yearly' },
    { path: '/privacy', priority: '0.3', changefreq: 'yearly' }
  ]

  // Generate XML
  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">`

  // Add static pages
  staticPages.forEach(page => {
    sitemap += `
  <url>
    <loc>${baseUrl}${page.path}</loc>
    <lastmod>2024-01-20</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>`
    
    // Add logo image for homepage
    if (page.path === '') {
      sitemap += `
    <image:image>
      <image:loc>${baseUrl}/images/logo.png</image:loc>
      <image:title>Casa da Pedra - Turismo e Aventura</image:title>
      <image:caption>Especialistas em experiências únicas de turismo e aventura</image:caption>
    </image:image>`
    }
    
    sitemap += `
  </url>`
  })

  // Add tours
  tours.forEach(tour => {
    sitemap += `
  <url>
    <loc>${baseUrl}/tours/${tour.slug}</loc>
    <lastmod>${tour.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>`
    
    if (tour.images && tour.images.length > 0) {
      sitemap += `
    <image:image>
      <image:loc>${tour.images[0]}</image:loc>
      <image:title>${tour.title}</image:title>
      <image:caption>${tour.title} - Casa da Pedra</image:caption>
    </image:image>`
    }
    
    sitemap += `
  </url>`
  })

  // Add accommodations
  accommodations.forEach(accommodation => {
    sitemap += `
  <url>
    <loc>${baseUrl}/accommodations/${accommodation.slug}</loc>
    <lastmod>${accommodation.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>`
    
    if (accommodation.images && accommodation.images.length > 0) {
      sitemap += `
    <image:image>
      <image:loc>${accommodation.images[0]}</image:loc>
      <image:title>${accommodation.title}</image:title>
      <image:caption>${accommodation.title} - Casa da Pedra</image:caption>
    </image:image>`
    }
    
    sitemap += `
  </url>`
  })

  sitemap += `
</urlset>`

  // Set proper headers
  setHeader(event, 'Content-Type', 'application/xml')
  setHeader(event, 'Cache-Control', 'public, max-age=86400') // Cache for 24 hours

  return sitemap
})
