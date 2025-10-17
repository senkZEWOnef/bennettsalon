import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    define: {
      // Expose DATABASE_URL to the client (be careful in production)
      'import.meta.env.DATABASE_URL': JSON.stringify(env.DATABASE_URL),
      // Define process for compatibility
      'process.env': {}
    },
  }
})