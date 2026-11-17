/**
 * Resolves localized fields from a Firestore document for the active locale.
 * Falls back to the root Portuguese (pt-BR) fields when a translation is missing.
 */
function resolveTranslationKey(locale: string): string {
  return locale === 'en' ? 'en-US' : locale
}

export function hasDocTranslation(doc: Record<string, any> | null | undefined, locale: string): boolean {
  if (!doc) return false
  const key = resolveTranslationKey(locale)
  if (key === 'pt-BR') return true
  const tr = doc.translations?.[key]
  return Boolean(tr && (tr.titulo?.trim() || tr.conteudo?.trim() || tr.descricao?.trim()))
}

export function useLocalizedDoc<T extends Record<string, any>>(
  doc: T | null | undefined,
  locale: string
): (T & { _isFallback: boolean }) | null {
  if (!doc) return null
  const key = resolveTranslationKey(locale)
  if (key === 'pt-BR') {
    return { ...doc, _isFallback: false }
  }

  const tr = doc.translations?.[key]
  if (!hasDocTranslation(doc, key)) {
    return { ...doc, _isFallback: true }
  }

  const overrides: Record<string, any> = {}
  for (const [key, value] of Object.entries(tr)) {
    if ((typeof value === 'string' && value.trim() !== '') || (typeof value === 'number' && !Number.isNaN(value))) {
      overrides[key] = value
    }
  }

  return {
    ...doc,
    ...overrides,
    _isFallback: false
  }
}
