// SVG staff renderer for treble clef notes
// staffStep mapping (same as notes.js):
//   2 = E4 (1st line), 3 = F4 (1st space), 4 = G4 (2nd line), 5 = A4 (2nd space),
//   6 = B4 (3rd line), 7 = C5 (3rd space), 8 = D5 (4th line), 9 = E5 (4th space),
//   10 = F5 (5th line)
// Each step = 8px vertically (half a space)

const LINE_SPACING = 10 // px between staff lines
const NOTE_RADIUS = 8
const STAFF_LEFT = 80
const STAFF_RIGHT = 220
const STAFF_WIDTH = 300

// Y position for staffStep: step 2 (E4) = bottom line
// Bottom line Y = 100, each step up = -5px (half LINE_SPACING)
function stepToY(step) {
  const BOTTOM_LINE_Y = 110
  return BOTTOM_LINE_Y - (step - 2) * (LINE_SPACING / 2)
}

function NoteHead({ step, sharp = false }) {
  const cy = stepToY(step)
  const cx = STAFF_WIDTH / 2 + 10

  // Stem goes down-left for notes on/above the middle line (B4 = staffStep 6)
  const stemDown = step >= 6
  const stemX = stemDown ? cx - NOTE_RADIUS + 1 : cx + NOTE_RADIUS - 1
  const stemY2 = stemDown ? cy + 35 : cy - 35

  // Ledger lines needed
  const ledgerLines = []
  if (step <= 1) {
    for (let s = 2; s > step; s -= 2) ledgerLines.push(s - 2)
  }
  if (step >= 11) {
    for (let s = 10; s < step; s += 2) ledgerLines.push(s + 2)
  }

  return (
    <g>
      {ledgerLines.map((s) => (
        <line
          key={s}
          x1={cx - NOTE_RADIUS - 4}
          x2={cx + NOTE_RADIUS + 4}
          y1={stepToY(s)}
          y2={stepToY(s)}
          stroke="#333"
          strokeWidth={1.5}
        />
      ))}
      {sharp && (
        <text
          x={cx - NOTE_RADIUS - 14}
          y={cy + 5}
          fontSize="18"
          fill="#333"
          fontWeight="bold"
        >
          ♯
        </text>
      )}
      <ellipse
        cx={cx}
        cy={cy}
        rx={NOTE_RADIUS}
        ry={NOTE_RADIUS * 0.72}
        fill="#1a1a2e"
        transform={`rotate(-15, ${cx}, ${cy})`}
      />
      {/* Stem */}
      <line
        x1={stemX}
        y1={cy}
        x2={stemX}
        y2={stemY2}
        stroke="#1a1a2e"
        strokeWidth={1.8}
      />
    </g>
  )
}

export default function Staff({ staffStep, sharp = false, dimmed = false, small = false }) {
  const lines = [2, 4, 6, 8, 10] // staffSteps for the 5 lines
  const scale = small ? 0.6 : 1

  return (
    <svg
      width={STAFF_WIDTH * scale}
      height={200 * scale}
      viewBox={`0 0 ${STAFF_WIDTH} 200`}
      style={{ opacity: dimmed ? 0.25 : 1, transition: 'opacity 0.3s' }}
      aria-label="Music staff"
    >
      {/* Treble clef symbol */}
      <text
        x={18}
        y={stepToY(6) + 38}
        fontSize="90"
        fill="#4a4a6a"
        fontFamily="serif"
        style={{ userSelect: 'none' }}
      >
        𝄞
      </text>

      {/* Staff lines */}
      {lines.map((step) => (
        <line
          key={step}
          x1={STAFF_LEFT}
          x2={STAFF_RIGHT + 20}
          y1={stepToY(step)}
          y2={stepToY(step)}
          stroke="#555"
          strokeWidth={1.5}
        />
      ))}

      {/* Note */}
      {staffStep != null && <NoteHead step={staffStep} sharp={sharp} />}
    </svg>
  )
}
