import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider } from 'antd'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider theme={{ token: { colorPrimary: '#009fa1', colorLink: '#008a8c', colorTextBase: '#032233', borderRadius: 8 } }}>
      <App />
    </ConfigProvider>
  </StrictMode>,
)
