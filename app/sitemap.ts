import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://venkateshlahori.com'

  let services: { id: string; updatedAt: Date }[] = []
  let products: { id: string; updatedAt: Date }[] = []

  try {
    // Fetch all active services
    services = await prisma.service.findMany({
      where: { isActive: true },
      select: { id: true, updatedAt: true }
    })

    // Fetch all active products
    products = await prisma.product.findMany({
      where: { isActive: true },
      select: { id: true, updatedAt: true }
    })
  } catch (error) {
    console.warn('Failed to fetch data for sitemap (using static pages only):', error)
  }

  const serviceUrls = services.map((service) => ({
    url: `${baseUrl}/services/${service.id}`,
    lastModified: service.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const productUrls = products.map((product) => ({
    url: `${baseUrl}/products/${product.id}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...serviceUrls,
    ...productUrls,
  ]
}
