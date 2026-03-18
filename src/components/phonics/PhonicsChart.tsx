import { motion } from 'framer-motion';
import { Card } from '../ui';

interface PhonicsChartProps {
  progress: Record<string, number>;
  onSoundClick?: (soundId: string) => void;
}

const JOLLY_PHONICS_GROUPS: string[][] = [
  ['s', 'a', 't', 'i', 'p', 'n'],
  ['ck', 'e', 'h', 'r', 'm', 'd'],
  ['g', 'o', 'u', 'l', 'f', 'b'],
  ['ai', 'j', 'oa', 'ie', 'ee', 'or'],
  ['z', 'w', 'ng', 'v', 'oo', 'oo'],
  ['y', 'x', 'ch', 'sh', 'th', 'th'],
  ['qu', 'ou', 'oi', 'ue', 'er', 'ar'],
];

function getMasteryColor(level: number): { bg: string; text: string; border: string } {
  if (level <= 0) return { bg: '#f0f0f0', text: '#999', border: '#ddd' };
  if (level < 30) return { bg: 'rgba(249,168,37,0.15)', text: '#F9A825', border: '#FDD835' };
  if (level < 70) return { bg: '#FFE0B2', text: '#E65100', border: '#FF9800' };
  return { bg: '#C8E6C9', text: '#2E7D32', border: '#4CAF50' };
}

function getMasteryLabel(level: number): string {
  if (level <= 0) return 'Not started';
  if (level < 30) return 'Introduced';
  if (level < 70) return 'Practicing';
  return 'Mastered';
}

export const PhonicsChart: React.FC<PhonicsChartProps> = ({ progress, onSoundClick }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        padding: '1.5rem',
        fontFamily: 'Nunito, sans-serif',
      }}
    >
      <h2 style={{ color: '#1A6B5A', margin: 0, fontSize: '1.4rem', textAlign: 'center' }}>
        My Phonics Journey
      </h2>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {[
          { label: 'Not started', color: '#f0f0f0', border: '#ddd' },
          { label: 'Introduced', color: 'rgba(249,168,37,0.15)', border: '#FDD835' },
          { label: 'Practicing', color: '#FFE0B2', border: '#FF9800' },
          { label: 'Mastered', color: '#C8E6C9', border: '#4CAF50' },
        ].map((item) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <div
              style={{
                width: '1rem',
                height: '1rem',
                borderRadius: '0.25rem',
                backgroundColor: item.color,
                border: `2px solid ${item.border}`,
              }}
            />
            <span style={{ fontSize: '0.8rem', color: '#666' }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <Card variant="elevated" padding="lg">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {JOLLY_PHONICS_GROUPS.map((group, rowIndex) => (
            <div key={rowIndex} style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
              <span
                style={{
                  width: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#999',
                }}
              >
                {rowIndex + 1}
              </span>
              {group.map((sound, colIndex) => {
                const soundId = `${sound}-${rowIndex}-${colIndex}`;
                const level = progress[sound] ?? progress[soundId] ?? 0;
                const colors = getMasteryColor(level);
                const label = getMasteryLabel(level);

                return (
                  <motion.button
                    key={soundId}
                    onClick={() => onSoundClick?.(sound)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title={`${sound}: ${label} (${level}%)`}
                    style={{
                      width: '3.5rem',
                      height: '3.5rem',
                      borderRadius: '0.75rem',
                      border: `2px solid ${colors.border}`,
                      backgroundColor: colors.bg,
                      color: colors.text,
                      fontSize: '1.1rem',
                      fontWeight: 800,
                      fontFamily: 'Nunito, sans-serif',
                      cursor: onSoundClick ? 'pointer' : 'default',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.1rem',
                      boxShadow: level > 0 ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                    }}
                    aria-label={`Sound ${sound}: ${label}`}
                  >
                    <span>{sound}</span>
                    {level > 0 && (
                      <span style={{ fontSize: '0.55rem', fontWeight: 600 }}>{level}%</span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

PhonicsChart.displayName = 'PhonicsChart';
