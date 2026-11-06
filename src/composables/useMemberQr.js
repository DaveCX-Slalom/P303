import { ref, watch } from 'vue'
import QRCode from 'qrcode'

// Renders the member code as a QR data URL. Works offline: nothing is fetched.
export function useMemberQr(codeSource, width = 560) {
  const url = ref('')
  watch(
    codeSource,
    async (code) => {
      if (code) url.value = await QRCode.toDataURL(code, { margin: 2, width, errorCorrectionLevel: 'M' })
    },
    { immediate: true }
  )
  return url
}
