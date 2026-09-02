import { fetchFirestoreCollection } from '../../utils/firestore'

export default defineCachedEventHandler(
  async () => {
    const list = await fetchFirestoreCollection('estudos')
    return list.sort((a: any, b: any) => {
      const dateA = new Date(a.createdAt || 0).getTime()
      const dateB = new Date(b.createdAt || 0).getTime()
      return dateB - dateA
    })
  },
  {
    maxAge: 60 * 60, // 1 hora de cache
    swr: true,
    name: 'api-estudos'
  }
)
