import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{md,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 主色 - Teal 深青色（区别于 Audible 橙色，避免商标冲突）
        primary: {
          DEFAULT: '#0F766E', // Teal-700
          hover: '#0D5D57',
          light: '#CCFBF1', // Teal-100
          50: '#F0FDFA',
          100: '#CCFBF1',
          200: '#99F6E4',
          300: '#5EEAD4',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          800: '#115E59',
          900: '#134E4A',
        },
        // 强调色 - Amber 琥珀色（Value Score 徽章，暗示价值）
        accent: {
          DEFAULT: '#F59E0B', // Amber-500
          light: '#FEF3C7', // Amber-100
          50: '#FFFBEB',
          100: '#FEF3C7',
          200: '#FDE68A',
          300: '#FCD34D',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
          800: '#92400E',
          900: '#78350F',
        },
        // 中性色
        bg: {
          base: '#FFFFFF',
          surface: '#F9FAFB', // Gray-50
          elevated: '#FFFFFF',
        },
        border: {
          DEFAULT: '#E5E7EB', // Gray-200
        },
        text: {
          primary: '#111827', // Gray-900
          secondary: '#6B7280', // Gray-500
          muted: '#9CA3AF', // Gray-400
        },
        // 语义色
        success: '#059669', // Green-600
        warning: '#D97706', // Amber-600
        danger: '#DC2626', // Red-600
        info: '#2563EB', // Blue-600
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      // 4px 网格间距
      spacing: {
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        8: '32px',
        10: '40px',
        12: '48px',
        16: '64px',
        20: '80px',
        24: '96px',
      },
      maxWidth: {
        content: '1200px',
      },
      // 微交互 - 禁止弹跳缓动
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
