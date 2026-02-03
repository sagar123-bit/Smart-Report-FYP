import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import router from './routes'
import { Provider } from 'react-redux'
import { store } from './store'
import LiveSocketProvider from './services/socketContext'



createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <LiveSocketProvider>
    <RouterProvider router={router}/>
        </LiveSocketProvider>
    </Provider>
)
