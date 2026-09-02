import { fetchFirestoreDoc } from '../../utils/firestore'

export default defineCachedEventHandler(
  async (event) => {
    const id = getRouterParam(event, 'id')
    if (!id) return null
    return await fetchFirestoreDoc('devocionais', id)
  },
  {
    maxAge: 60 * 60, // 1 hora de cache
    swr: true,
    name: 'api-devocional-id',
    getKey: (event) => `devocional-${getRouterParam(event, 'id')}`
  }
)
