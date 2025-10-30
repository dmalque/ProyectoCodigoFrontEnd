import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold text-blue-600">Farmacia Transfer</h1>
      <p className="mt-4 text-gray-700 text-lg">
        Gestión inteligente de stock y transferencias.
      </p>
      <button className="mt-6 px-6 py-3 bg-blue-500 text-white font-semibold rounded-xl shadow hover:bg-blue-600 transition-all">
        Empezar
      </button>
    </div>
  )
}

export default App

