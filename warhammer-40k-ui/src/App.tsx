import './App.css'

// Fresh UI stub – we deliberately keep all the game rules/engine code in src/engine and src/types,
// but render only a minimal placeholder UI for now.

function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#000', color: '#f9fafb' }}>
      <div
        style={{
          maxWidth: 640,
          margin: '0 auto',
          padding: '4rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: '1rem',
        }}
      >
        <h1 style={{ fontSize: '1.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Warhammer 40,000 – 10th Edition
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#9ca3af' }}>
          Fresh start. The core game rules and engine logic are preserved under <code>src/engine</code> and
          <code> src/types.ts</code>, but the UI has been reset to this minimal placeholder.
        </p>
        <p style={{ fontSize: '0.9rem', color: '#9ca3af' }}>
          Next step: design a new main menu and skirmish flow on top of the existing rules engine.
        </p>
      </div>
    </div>
  )
}

export default App
