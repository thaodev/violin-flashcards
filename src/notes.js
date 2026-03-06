// Notes in first position on violin (treble clef)
// staffStep: position on the staff where 0 = middle C (C4), each step = one diatonic step
// Positive = above middle C, negative = below
// The 5 staff lines (bottom to top): E4, G4, B4, D5, F5
// Spaces (bottom to top): F4, A4, C5, E5
// staffLine: the y-position index used by the SVG renderer
//   We define: 0 = first ledger line below staff (C4), 1 = first space (D4), 2 = first line (E4), ...
//   Each integer = one diatonic step up

export const NOTES = [
  {
    name: 'G',
    octave: 4,
    staffStep: 4, // second line from bottom (G4)
    frequency: 392.0,
    string: 'G string',
    finger: 'Open string',
    fingerNumber: 0,
    description: 'Open G string — the lowest string on the violin',
  },
  {
    name: 'A',
    octave: 4,
    staffStep: 5, // second space from bottom (A4)
    frequency: 440.0,
    string: 'A string',
    finger: 'Open string',
    fingerNumber: 0,
    description: 'Open A string',
  },
  {
    name: 'B',
    octave: 4,
    staffStep: 6, // middle line (B4)
    frequency: 493.88,
    string: 'A string',
    finger: '1st finger',
    fingerNumber: 1,
    description: '1st finger on A string',
  },
  {
    name: 'C#',
    octave: 5,
    staffStep: 7, // third space (C#5)
    sharp: true,
    frequency: 554.37,
    string: 'A string',
    finger: '2nd finger (high)',
    fingerNumber: 2,
    description: '2nd finger on A string (high 2)',
  },
  {
    name: 'D',
    octave: 5,
    staffStep: 8, // fourth line (D5)
    frequency: 587.33,
    string: 'D string / Open D',
    finger: 'Open D or 3rd finger on A',
    fingerNumber: 0,
    description: 'Open D string (or 3rd finger on A string)',
  },
  {
    name: 'E',
    octave: 4,
    staffStep: 2, // first line (E4)
    frequency: 329.63,
    string: 'D string',
    finger: '1st finger',
    fingerNumber: 1,
    description: '1st finger on D string',
  },
]

export function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
