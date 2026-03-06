import { useState, useCallback } from 'react'
import { NOTES, shuffle } from './notes'
import Flashcard from './components/Flashcard'

const MODES = ['staff-to-name', 'name-to-staff']

function buildDeck() {
  // Mix both modes: each note appears once in each mode, shuffled
  const cards = NOTES.flatMap((note) =>
    MODES.map((mode) => ({ note, mode }))
  )
  return shuffle(cards)
}

export default function App() {
  const [deck, setDeck] = useState(buildDeck)
  const [index, setIndex] = useState(0)
  const [score, setScore] = useState({ correct: 0, total: 0 })
  const [cardKey, setCardKey] = useState(0) // force re-mount on next card
  const [sessionDone, setSessionDone] = useState(false)
  const [modeFilter, setModeFilter] = useState('both') // 'both' | 'staff-to-name' | 'name-to-staff'

  const current = deck[index]

  const handleCorrect = useCallback(() => {
    setScore((s) => ({ correct: s.correct + 1, total: s.total + 1 }))
  }, [])

  const handleWrong = useCallback(() => {
    setScore((s) => ({ correct: s.correct, total: s.total + 1 }))
  }, [])

  function nextCard() {
    if (index + 1 >= deck.length) {
      setSessionDone(true)
    } else {
      setIndex((i) => i + 1)
      setCardKey((k) => k + 1)
    }
  }

  function restart() {
    let newDeck
    if (modeFilter === 'both') {
      newDeck = buildDeck()
    } else {
      newDeck = shuffle(NOTES.map((note) => ({ note, mode: modeFilter })))
    }
    setDeck(newDeck)
    setIndex(0)
    setCardKey((k) => k + 1)
    setScore({ correct: 0, total: 0 })
    setSessionDone(false)
  }

  const pct = score.total > 0 ? Math.round((score.correct / score.total) * 100) : null

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>🎻 Violin Notes</h1>
        <div style={styles.scoreBar}>
          <span style={styles.scoreText}>
            {score.correct}/{score.total}
            {pct !== null && <span style={styles.pct}> ({pct}%)</span>}
          </span>
          <div style={styles.progressBg}>
            <div
              style={{
                ...styles.progressFill,
                width: `${deck.length > 0 ? (index / deck.length) * 100 : 0}%`,
              }}
            />
          </div>
          <span style={styles.cardCount}>
            {index + 1}/{deck.length}
          </span>
        </div>
      </header>

      {/* Mode filter */}
      <div style={styles.modeRow}>
        {[
          { value: 'both', label: 'Both' },
          { value: 'staff-to-name', label: 'Staff → Name' },
          { value: 'name-to-staff', label: 'Name → Staff' },
        ].map(({ value, label }) => (
          <button
            key={value}
            style={{
              ...styles.modeBtn,
              background: modeFilter === value ? '#5c6bc0' : '#ececf8',
              color: modeFilter === value ? '#fff' : '#444',
            }}
            onClick={() => {
              setModeFilter(value)
            }}
          >
            {label}
          </button>
        ))}
      </div>

      <main style={styles.main}>
        {sessionDone ? (
          <div style={styles.doneCard}>
            <div style={styles.doneEmoji}>
              {pct >= 80 ? '🌟' : pct >= 50 ? '👍' : '💪'}
            </div>
            <h2 style={styles.doneTitle}>Session complete!</h2>
            <p style={styles.doneScore}>
              {score.correct} / {score.total} correct ({pct}%)
            </p>
            <p style={styles.doneMsg}>
              {pct >= 80
                ? 'Excellent work — keep practising!'
                : pct >= 50
                ? 'Good progress — try again to improve!'
                : 'Keep going — it takes repetition!'}
            </p>
            <button style={styles.restartBtn} onClick={restart}>
              New Session
            </button>
          </div>
        ) : (
          <>
            <Flashcard
              key={cardKey}
              note={current.note}
              mode={current.mode}
              onCorrect={handleCorrect}
              onWrong={handleWrong}
              allNotes={NOTES}
            />
            <button style={styles.nextBtn} onClick={nextCard}>
              Next card →
            </button>
          </>
        )}
      </main>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #e8eaf6 0%, #fce4ec 100%)',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  header: {
    width: '100%',
    maxWidth: 420,
    padding: '20px 20px 0',
    boxSizing: 'border-box',
  },
  title: {
    margin: 0,
    fontSize: 26,
    fontWeight: 800,
    color: '#1a1a2e',
    textAlign: 'center',
    letterSpacing: '-0.5px',
  },
  scoreBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: 700,
    color: '#3949ab',
    minWidth: 56,
  },
  pct: {
    fontWeight: 400,
    color: '#888',
  },
  progressBg: {
    flex: 1,
    height: 6,
    background: '#d0d0e8',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: '#5c6bc0',
    borderRadius: 3,
    transition: 'width 0.3s',
  },
  cardCount: {
    fontSize: 13,
    color: '#888',
    minWidth: 40,
    textAlign: 'right',
  },
  modeRow: {
    display: 'flex',
    gap: 8,
    margin: '16px 0 12px',
  },
  modeBtn: {
    padding: '6px 14px',
    borderRadius: 20,
    border: 'none',
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  main: {
    width: '100%',
    maxWidth: 420,
    padding: '0 16px 32px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 16,
  },
  nextBtn: {
    padding: '12px 32px',
    borderRadius: 10,
    border: 'none',
    background: '#5c6bc0',
    color: '#fff',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(92,107,192,0.3)',
  },
  doneCard: {
    background: '#fff',
    borderRadius: 20,
    padding: '36px 28px',
    textAlign: 'center',
    boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
  },
  doneEmoji: { fontSize: 56 },
  doneTitle: { margin: 0, fontSize: 24, fontWeight: 800, color: '#1a1a2e' },
  doneScore: { margin: 0, fontSize: 20, fontWeight: 700, color: '#3949ab' },
  doneMsg: { margin: 0, fontSize: 14, color: '#777', maxWidth: 260 },
  restartBtn: {
    marginTop: 12,
    padding: '12px 32px',
    borderRadius: 10,
    border: 'none',
    background: '#5c6bc0',
    color: '#fff',
    fontSize: 16,
    fontWeight: 700,
    cursor: 'pointer',
  },
}
