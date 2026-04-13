import AppRoutes from './components/Approutes'
import { Toaster } from "sonner"

function App() {
  return (
    <>
      <Toaster richColors position="top-right" />
      <AppRoutes/>
    </>
  )
}

export default App
