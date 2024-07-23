import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/containers/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      primary: {
        50: '#F9FDF1',
        100: '#EFF9D7',
        200: '#E4F5BC',
        300: '#DFF3AF',
        400: '#DAF1A2',
        500: '#BACE8A',
        600: '#9BAC73',
        700: '#7C895C',
        800: '#5D6745',
        900: '#3E442E',
        950: '#1F2217',
      },
      gray: {
        dark: '#CCCED0',
        medium: '#ECECEE',
        light: '#F6F6F6'
      },
      secondary: '#3E3E3E',
    },
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontFamily: {
        pretendard: ["var(--font-pretendard)"]
      }
    },
  },
  plugins: [],
}
export default config
