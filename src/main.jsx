import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import './index.css'
import { findRoute } from './routes.jsx'
import { initAnalytics } from './analytics.js'

initAnalytics()

const { Component } = findRoute(window.location.pathname)

hydrateRoot(
  document.getElementById('root'),
  <StrictMode>
    <Component />
  </StrictMode>,
)
