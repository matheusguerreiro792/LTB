import { fetchFirestoreDoc } from '../../utils/firestore'

export default defineCachedEventHandler(
  async (event) => {
    const id = getRouterParam(event, 'id')
    if (!id) return null
    return await fetchFirestoreDoc('devocionais', id)
  },
  {
    maxAge: import.meta.dev ? 0 : 60 * 60, // 1 hora de cache em produção
    swr: !import.meta.dev,
    shouldBypassCache: () => import.meta.dev,
    name: 'api-devocional-id',
    getKey: (event) => `devocional-${getRouterParam(event, 'id')}`
  }
)
