import { View } from 'react-native';
import styles from '@/styles/qr-code.styles';

type QrCodeProps = {
  /** Value encoded in the pattern; drives the deterministic pattern. */
  value: string;
  size?: number;
};

/**
 * Decorative QR-style pattern rendered with pure Views — no native module,
 * no dependency. The pattern is deterministic from `value` so the same code
 * always shows the same square pattern. This is a UI mock: it is not a
 * scannable QR code.
 */
export function QrCode({ value, size = 220 }: QrCodeProps) {
  const modules = 21; // 21x21 like a real QR code
  const cell = size / modules;

  // Simple deterministic hash -> pattern (finder squares included visually)
  let seed = 0;
  for (let i = 0; i < value.length; i += 1) {
    seed = (seed * 31 + value.charCodeAt(i)) >>> 0;
  }

  const isFinder = (row: number, col: number) => {
    const inTopLeft = row < 7 && col < 7;
    const inTopRight = row < 7 && col >= modules - 7;
    const inBottomLeft = row >= modules - 7 && col < 7;
    if (!inTopLeft && !inTopRight && !inBottomLeft) return false;

    const localRow = inBottomLeft ? row - (modules - 7) : row;
    const localCol = inTopRight ? col - (modules - 7) : col;
    // 7x7 finder: outer ring, 3x3 middle block
    const ring =
      localRow === 0 || localRow === 6 || localCol === 0 || localCol === 6;
    const middle = localRow >= 2 && localRow <= 4 && localCol >= 2 && localCol <= 4;
    return ring || middle;
  };

  const cells = [];
  for (let row = 0; row < modules; row += 1) {
    for (let col = 0; col < modules; col += 1) {
      if (isFinder(row, col)) continue; // finder squares drawn separately

      seed = (seed * 1103515245 + 12345) >>> 0;
      const on = (seed >>> 16) % 100 < 45;
      if (on) {
        cells.push(
          <View
            key={`${row}-${col}`}
            style={[
              styles.cell,
              {
                left: col * cell,
                top: row * cell,
                width: cell,
                height: cell,
              },
            ]}
          />
        );
      }
    }
  }

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Finder squares */}
      <View style={[styles.finder, { top: 0, left: 0 }]} />
      <View style={[styles.finder, { top: 0, left: size - cell * 7 }]} />
      <View style={[styles.finder, { top: size - cell * 7, left: 0 }]} />

      {cells}
    </View>
  );
}
