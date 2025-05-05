import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        first: {
          "0%": { transform: "translateY(-100%)" },
          "10%": { transform: "translateY(-50%)" },
          "40%": { transform: "translateY(-10%)" },
          "50%": { transform: "translateY(0%)" },
          "60%": { transform: "translateY(10%)" },
          "90%": { transform: "translateY(50%)" },
          "100%": { transform: "translateY(100%)" },
        },
        second: {
          "0%": { transform: "translateY(100%)" },
          "10%": { transform: "translateY(50%)" },
          "40%": { transform: "translateY(10%)" },
          "50%": { transform: "translateY(0%)" },
          "60%": { transform: "translateY(-10%)" },
          "90%": { transform: "translateY(-50%)" },
          "100%": { transform: "translateY(-100%)" },
        },
        third: {
          "0%": { transform: "translateX(100%)" },
          "10%": { transform: "translateX(50%)" },
          "40%": { transform: "translateX(10%)" },
          "50%": { transform: "translateX(0%)" },
          "60%": { transform: "translateX(-10%)" },
          "90%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        fourth: {
          "0%": { transform: "translateX(-100%)" },
          "10%": { transform: "translateX(-50%)" },
          "40%": { transform: "translateX(-10%)" },
          "50%": { transform: "translateX(0%)" },
          "60%": { transform: "translateX(10%)" },
          "90%": { transform: "translateX(50%)" },
          "100%": { transform: "translateX(100%)" },
        },
        fifth: {
          "0%": { transform: "translateX(100%) translateY(100%)" },
          "10%": { transform: "translateX(50%) translateY(50%)" },
          "40%": { transform: "translateX(10%) translateY(10%)" },
          "50%": { transform: "translateX(0%) translateY(0%)" },
          "60%": { transform: "translateX(-10%) translateY(-10%)" },
          "90%": { transform: "translateX(-50%) translateY(-50%)" },
          "100%": { transform: "translateX(-100%) translateY(-100%)" },
        },
        aurora: {
          from: { backgroundPosition: "50% 50%, 50% 50%" },
          to: { backgroundPosition: "350% 50%, 350% 50%" },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'shimmer': 'shimmer 2s linear infinite',
        'first': 'first 10s linear infinite',
        'second': 'second 12s linear infinite',
        'third': 'third 8s linear infinite',
        'fourth': 'fourth 15s linear infinite',
        'fifth': 'fifth 10s linear infinite',
        'aurora': 'aurora 60s linear infinite',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography')
  ],
};
export default config;
