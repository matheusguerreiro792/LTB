export interface PixPayloadOptions {
  pixKey: string
  merchantName: string
  merchantCity: string
  amount?: number
  txid?: string
}

function formatTlv(id: string, value: string): string {
  const len = value.length.toString().padStart(2, '0')
  return `${id}${len}${value}`
}

function sanitizeAscii(text: string, maxLength: number): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9 .,-]/g, '')
    .trim()
    .slice(0, maxLength)
    .toUpperCase()
}

function crc16Ccitt(payload: string): string {
  let crc = 0xffff
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff
      } else {
        crc = (crc << 1) & 0xffff
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0')
}

export function buildPixPayload(options: PixPayloadOptions): string {
  const key = options.pixKey.trim()
  if (!key) return ''

  const merchantName = sanitizeAscii(options.merchantName || 'VIVA A BIBLIA', 25) || 'VIVA A BIBLIA'
  const merchantCity = sanitizeAscii(options.merchantCity || 'SAO PAULO', 15) || 'SAO PAULO'
  const txid = (options.txid || '***').replace(/[^A-Za-z0-9*]/g, '').slice(0, 25) || '***'

  const merchantAccountInfo =
    formatTlv('00', 'br.gov.bcb.pix') +
    formatTlv('01', key)

  const parts = [
    formatTlv('00', '01'),
    formatTlv('26', merchantAccountInfo),
    formatTlv('52', '0000'),
    formatTlv('53', '986'),
  ]

  if (typeof options.amount === 'number' && Number.isFinite(options.amount) && options.amount >= 1) {
    parts.push(formatTlv('54', options.amount.toFixed(2)))
  }

  parts.push(
    formatTlv('58', 'BR'),
    formatTlv('59', merchantName),
    formatTlv('60', merchantCity),
    formatTlv('62', formatTlv('05', txid))
  )

  const payloadWithoutCrc = `${parts.join('')}6304`
  return `${payloadWithoutCrc}${crc16Ccitt(payloadWithoutCrc)}`
}
