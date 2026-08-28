/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          base: 'var(--surface-base)',
          raised: 'var(--surface-raised)',
          overlay: 'var(--surface-overlay)',
          subtle: 'var(--surface-subtle)',
          sunken: 'var(--surface-sunken)',
        },
        text: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          muted: 'var(--text-muted)',
          inverse: 'var(--text-inverse)',
        },
        border: {
          default: 'var(--border-default)',
          subtle: 'var(--border-subtle)',
          strong: 'var(--border-strong)',
          accent: 'var(--border-accent)',
        },
        accent: {
          primary: 'var(--accent-primary)',
          'primary-hover': 'var(--accent-primary-hover)',
          'primary-active': 'var(--accent-primary-active)',
          'primary-fg': 'var(--accent-primary-fg)',
          secondary: 'var(--accent-secondary)',
          'secondary-fg': 'var(--accent-secondary-fg)',
          muted: 'var(--accent-muted)',
        },
        status: {
          success: 'var(--status-success)',
          'success-fg': 'var(--status-success-fg)',
          warning: 'var(--status-warning)',
          'warning-fg': 'var(--status-warning-fg)',
          danger: 'var(--status-danger)',
          'danger-fg': 'var(--status-danger-fg)',
          info: 'var(--status-info)',
          'info-fg': 'var(--status-info-fg)',
        },
      },
      ringColor: {
        focus: 'var(--ring-focus)',
      },
      ringOffsetColor: {
        'surface-base': 'var(--surface-base)',
        'surface-raised': 'var(--surface-raised)',
      },
      boxShadow: {
        subtle: 'var(--shadow-subtle)',
        raised: 'var(--shadow-raised)',
        glow: 'var(--shadow-glow)',
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
      fontFamily: {
        ui: ['var(--font-ui)'],
        display: ['var(--font-display)'],
        mono: ['var(--font-mono)'],
        handwriting: ['var(--font-handwriting)'],
      },
      transitionDuration: {
        fast: 'var(--motion-duration-fast)',
        normal: 'var(--motion-duration-normal)',
        slow: 'var(--motion-duration-slow)',
      },
      transitionTimingFunction: {
        clinical: 'var(--motion-ease-clinical)',
        spring: 'var(--motion-ease-spring)',
        standard: 'var(--motion-ease-standard)',
      },
      minHeight: {
        touch: '44px',
      },
      minWidth: {
        touch: '44px',
      },
    },
  },
  plugins: [],
};
