import { StrictMode } from 'react'
import { hydrateRoot } from 'react-dom/client'
import './index.css'
import { findRoute } from './routes.jsx'

const { Component } = findRoute(window.location.pathname)

hydrateRoot(
  document.getElementById('root'),
  <StrictMode>
    <Component />
  </StrictMode>,
)
