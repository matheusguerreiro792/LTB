import { fetchFirestoreCollection } from '../utils/firestore'

export default defineCachedEventHandler(
  async () => {
    const list = await fetchFirestoreCollection('materiais')
    // Ordenar decrescente por createdAt
    return list.sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt || 0).getTime()
      const dateB = new Date(b.createdAt || 0).getTime()
      return dateB - dateA
    })
  },
  {
    maxAge: import.meta.dev ? 0 : 60 * 60, // 1 hora de cache em produção
    swr: !import.meta.dev,       // Stale-While-Revalidate em produção
    shouldBypassCache: () => import.meta.dev,
    name: 'api-materiais'
  }
)
