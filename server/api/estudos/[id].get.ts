import { fetchFirestoreDoc } from '../../utils/firestore'

export default defineCachedEventHandler(
  async (event) => {
    const id = getRouterParam(event, 'id')
    if (!id) return null
    return await fetchFirestoreDoc('estudos', id)
  },
  {
    maxAge: 60 * 60, // 1 hora de cache
    swr: true,
    name: 'api-estudo-id',
    getKey: (event) => `estudo-${getRouterParam(event, 'id')}`
  }
)
