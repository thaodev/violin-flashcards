import { useState, useMemo } from 'react'
import Staff from './Staff'
import { playNote } from '../audio'

function buildStaffChoices(note, allNotes) {
  const wrong = allNotes
    .filter((n) => n.staffStep !== note.staffStep)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map((n) => ({ staffStep: n.staffStep, sharp: n.sharp, isCorrect: false }))
  return [
    { staffStep: note.staffStep, sharp: note.sharp, isCorrect: true },
    ...wrong,
  ].sort(() => Math.random() - 0.5)
}

// Pick a neighboring note as a hint (adjacent staffStep in allNotes)
function pickHintNote(note, allNotes) {
  const idx = allNotes.findIndex((n) => n.name === note.name)
  const candidates = []
  if (idx > 0) candidates.push({ ...allNotes[idx - 1], side: 'left' })
  if (idx < allNotes.length - 1) candidates.push({ ...allNotes[idx + 1], side: 'right' })
  if (candidates.length === 0) return null
  return candidates[Math.floor(Math.random() * candidates.length)]
}

export default function Flashcard({ note, mode, onCorrect, onWrong, allNotes, easy = false }) {
  const [answered, setAnswered] = useState(null)
  const [guessStep, setGuessStep] = useState(null)

  const isStaffToName = mode === 'staff-to-name'

  const staffChoices = useMemo(
    () => buildStaffChoices(note, allNotes),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [note.name]
  )

  // Hint note for easy mode (stable per card)
  const hintNote = useMemo(
    () => (easy ? pickHintNote(note, allNotes) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [note.name, easy]
  )

  function handleNameGuess(guessedNote) {
    if (answered) return
    const correct = guessedNote.name === note.name
    setGuessStep(guessedNote.name)
    setAnswered(correct ? 'correct' : 'wrong')
    playNote(note.frequency)
    if (correct) onCorrect()
    else onWrong()
  }

  function handleStaffGuess(choice) {
    if (answered) return
    setGuessStep(choice.staffStep)
    setAnswered(choice.isCorrect ? 'correct' : 'wrong')
    playNote(note.frequency)
    if (choice.isCorrect) onCorrect()
    else onWrong()
  }

  const cardBg =
    answered === 'correct'
      ? '#e8f5e9'
      : answered === 'wrong'
      ? '#ffebee'
      : '#ffffff'

  return (
    <div style={styles.wrapper}>
      <div style={{ ...styles.card, background: cardBg }}>

        {/* Easy badge */}
        {easy && <div style={styles.easyBadge}>⭐ Easy</div>}

        {/* Prompt */}
        <div style={styles.front}>
          {isStaffToName ? (
            <>
              <p style={styles.prompt}>
                {easy ? 'Use the hint — what is the mystery note?' : 'What note is this?'}
              </p>
              <Staff staffStep={note.staffStep} sharp={note.sharp} hintNote={hintNote} />
            </>
          ) : (
            <>
              <p style={styles.prompt}>
                {easy ? 'Use the hint — where does this note sit?' : 'Where does this note sit on the staff?'}
              </p>
              <div style={styles.bigNoteName}>{note.name}</div>
              {easy && hintNote && (
                <p style={styles.hintText}>
                  Hint: <strong>{hintNote.name}</strong> is {hintNote.side === 'left' ? 'just before' : 'just after'} it
                </p>
              )}
            </>
          )}
        </div>

        {/* Answer area */}
        {isStaffToName ? (
          <div style={styles.choicesArea}>
            <p style={styles.chooseLabel}>Choose the note name:</p>
            <div style={styles.choiceGrid}>
              {allNotes.map((n) => {
                let bg = '#f0f0f8'
                let color = '#333'
                if (answered) {
                  if (n.name === note.name) { bg = '#4caf50'; color = '#fff' }
                  else if (n.name === guessStep) { bg = '#ef5350'; color = '#fff' }
                }
                return (
                  <button
                    key={n.name}
                    style={{ ...styles.choiceBtn, background: bg, color }}
                    onClick={() => handleNameGuess(n)}
                    disabled={!!answered}
                  >
                    {n.name}
                  </button>
                )
              })}
            </div>
          </div>
        ) : (
          <div style={styles.staffChoicesArea}>
            <p style={styles.chooseLabel}>Tap the correct staff position:</p>
            <div style={styles.staffGrid}>
              {staffChoices.map((choice, i) => {
                let border = '2px solid #ddd'
                let bg = '#fafafa'
                if (answered) {
                  if (choice.isCorrect) { border = '2px solid #4caf50'; bg = '#e8f5e9' }
                  else if (choice.staffStep === guessStep && !choice.isCorrect) {
                    border = '2px solid #ef5350'; bg = '#ffebee'
                  }
                }
                return (
                  <button
                    key={i}
                    style={{ ...styles.staffChoiceBtn, border, background: bg }}
                    onClick={() => handleStaffGuess(choice)}
                    disabled={!!answered}
                  >
                    <Staff
                      staffStep={choice.staffStep}
                      sharp={choice.sharp}
                      small
                      hintNote={
                        easy && hintNote
                          ? { ...hintNote, side: hintNote.side }
                          : null
                      }
                    />
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Reveal panel */}
        {answered && (
          <div style={styles.revealPanel}>
            <div style={styles.revealRow}>
              <span style={answered === 'correct' ? styles.correct : styles.wrong}>
                {answered === 'correct' ? '✓ Correct!' : `✗ It's ${note.name}`}
              </span>
            </div>
            <div style={styles.fingeringBox}>
              <span style={styles.fingeringLabel}>🎻 {note.string}</span>
              <span style={styles.fingeringLabel}>👆 {note.finger}</span>
              <span style={styles.fingeringDesc}>{note.description}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    width: '100%',
    maxWidth: 420,
    margin: '0 auto',
  },
  card: {
    borderRadius: 16,
    boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
    padding: '24px 20px 20px',
    transition: 'background 0.3s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 12,
  },
  easyBadge: {
    alignSelf: 'flex-start',
    background: '#fff9c4',
    border: '1px solid #f9a825',
    color: '#f57f17',
    borderRadius: 20,
    padding: '2px 10px',
    fontSize: 12,
    fontWeight: 700,
  },
  front: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    width: '100%',
  },
  prompt: {
    margin: 0,
    fontSize: 15,
    color: '#666',
    fontWeight: 500,
    textAlign: 'center',
  },
  bigNoteName: {
    fontSize: 72,
    fontWeight: 800,
    color: '#1a1a2e',
    lineHeight: 1,
    margin: '8px 0',
    fontFamily: 'serif',
  },
  hintText: {
    margin: '4px 0 0',
    fontSize: 13,
    color: '#5c6bc0',
    background: '#ede7f6',
    borderRadius: 8,
    padding: '4px 12px',
  },
  choicesArea: {
    width: '100%',
    borderTop: '1px solid #eee',
    paddingTop: 12,
  },
  chooseLabel: {
    margin: '0 0 8px',
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
  },
  choiceGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'center',
  },
  choiceBtn: {
    width: 52,
    height: 52,
    borderRadius: 10,
    border: '2px solid #ddd',
    fontSize: 20,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'background 0.2s, color 0.2s',
    fontFamily: 'serif',
  },
  staffChoicesArea: {
    width: '100%',
    borderTop: '1px solid #eee',
    paddingTop: 12,
  },
  staffGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 10,
    width: '100%',
  },
  staffChoiceBtn: {
    borderRadius: 10,
    padding: '4px 0 0',
    cursor: 'pointer',
    transition: 'border 0.2s, background 0.2s',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  revealPanel: {
    width: '100%',
    borderTop: '1px solid #eee',
    paddingTop: 12,
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  revealRow: {
    textAlign: 'center',
  },
  correct: {
    color: '#2e7d32',
    fontWeight: 700,
    fontSize: 18,
  },
  wrong: {
    color: '#c62828',
    fontWeight: 700,
    fontSize: 18,
  },
  fingeringBox: {
    background: '#f8f8ff',
    borderRadius: 10,
    padding: '10px 14px',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  fingeringLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: '#3949ab',
  },
  fingeringDesc: {
    fontSize: 12,
    color: '#777',
  },
}
