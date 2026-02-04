import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import router from './routes'
import { Provider } from 'react-redux'
import { store } from './store'
import LiveSocketProvider from './services/socketContext'
import { Suspense } from 'react'
import LoadingScreen from './components/CommonSkeleton'
import "./i18n/i18n.js";



createRoot(document.getElementById('root')).render(
    <Suspense fallback={<LoadingScreen />}>
    <Provider store={store}>
        <LiveSocketProvider>
    <RouterProvider router={router}/>
        </LiveSocketProvider>
    </Provider>
    </Suspense>
)
