export function parseFirestoreDoc(doc: any) {
  if (!doc || !doc.fields) return null

  const parseValue = (val: any): any => {
    if (!val) return null
    if (val.stringValue !== undefined) return val.stringValue
    if (val.integerValue !== undefined) return Number(val.integerValue)
    if (val.doubleValue !== undefined) return Number(val.doubleValue)
    if (val.booleanValue !== undefined) return val.booleanValue
    if (val.timestampValue !== undefined) return val.timestampValue
    if (val.arrayValue !== undefined) {
      return (val.arrayValue.values || []).map(parseValue)
    }
    if (val.mapValue !== undefined) {
      const obj: Record<string, any> = {}
      for (const [k, v] of Object.entries(val.mapValue.fields || {})) {
        obj[k] = parseValue(v)
      }
      return obj
    }
    return val
  }

  const result: Record<string, any> = {
    id: doc.name ? doc.name.split('/').pop() : ''
  }

  for (const [key, val] of Object.entries(doc.fields)) {
    result[key] = parseValue(val)
  }

  return result
}

export async function fetchFirestoreCollection(collectionName: string) {
  const config = useRuntimeConfig()
  const projectId = config.public.firebase.projectId

  if (!projectId) {
    throw new Error('Firebase Project ID não configurado.')
  }

  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collectionName}?pageSize=100`

  const response = await fetch(url)
  if (!response.ok) {
    console.error(`Erro ao consultar ${collectionName} no Firestore:`, response.statusText)
    return []
  }

  const data = await response.json()
  if (!data.documents) return []

  return data.documents.map(parseFirestoreDoc).filter(Boolean)
}

export async function fetchFirestoreDoc(collectionName: string, id: string) {
  const config = useRuntimeConfig()
  const projectId = config.public.firebase.projectId

  if (!projectId) {
    throw new Error('Firebase Project ID não configurado.')
  }

  const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/${collectionName}/${id}`

  const response = await fetch(url)
  if (!response.ok) {
    if (response.status === 404) return null
    console.error(`Erro ao buscar doc ${id} de ${collectionName}:`, response.statusText)
    return null
  }

  const doc = await response.json()
  return parseFirestoreDoc(doc)
}
