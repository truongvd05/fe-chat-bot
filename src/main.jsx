import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import { persistor, store } from './store/store'
import '@fortawesome/fontawesome-free/css/all.min.css';
import { PersistGate } from 'redux-persist/integration/react'
import { ThemeProvider } from './contexts/ThemeContext'

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <ThemeProvider>
                <App />
            </ThemeProvider>
        </PersistGate>
    </Provider>
)
