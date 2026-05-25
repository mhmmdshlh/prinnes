import { Providers } from './providers'
import { AppRouter } from '../routes/router'

export default function App() {
  return (
    <Providers>
      <AppRouter />
    </Providers>
  )
}
