import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    basicSsl(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Alerta Criminal Premium',
        short_name: 'AlertaCriminal',
        description: 'Mapa de segurança inteligente e localização de incidentes.',
        theme_color: '#0f172a', // Cor do slate-900 (Nosso tema)
        background_color: '#0f172a',
        display: 'standalone', // Faz o app abrir como tela inteira, sem barra do nav
        icons: [
          // Temporário: ícones fakes só pro manifest não reclamar. Precisaremos colocar o logo do jacaré aqui depois
          { src: 'vite.svg', sizes: '192x192', type: 'image/svg+xml' },
          { src: 'vite.svg', sizes: '512x512', type: 'image/svg+xml' }
        ]
      }
    })
  ],
  server: {
    host: true
  }
})
