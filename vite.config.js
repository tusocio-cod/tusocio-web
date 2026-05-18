import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
    allowedHosts: [
      'tusocio-tusocio-web.8apc4h.easypanel.host',
      'www.tusocio.com.br',
      'tusocio.com.br'
    ]
  }
})