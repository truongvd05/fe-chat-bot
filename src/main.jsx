import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { persistor, store } from './store/store'
import '@fortawesome/fontawesome-free/css/all.min.css';
import { PersistGate } from 'redux-persist/integration/react'
import { ThemeProvider } from './contexts/ThemeContext'
import { SocketProvider } from './contexts/SocketContext'
import ErrorBoundary from './components/ErrorBoundary'

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <ThemeProvider>
                <SocketProvider>
                    <ErrorBoundary>
                        <App />
                    </ErrorBoundary>
                </SocketProvider>
            </ThemeProvider>
        </PersistGate>
    </Provider>
)
