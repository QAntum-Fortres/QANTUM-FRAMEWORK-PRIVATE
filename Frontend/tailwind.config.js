/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                sovereign: {
                    bg: '#050510', // Deep space blue-black
                    card: 'rgba(20, 20, 40, 0.6)',
                    text: '#ffffff',
                    muted: '#94a3b8',
                    accent: '#00f3ff', // Neon Cyan
                    secondary: '#7c3aed', // Deep Purple
                    success: '#10b981',
                    danger: '#ef4444',
                    border: 'rgba(255, 255, 255, 0.1)',
                },
                fontFamily: {
                    mono: ['JetBrains Mono', 'monospace'],
                    display: ['Orbitron', 'sans-serif'],
                }
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'glow': 'glow 2s ease-in-out infinite alternate',
                'spin-slow': 'spin 20s linear infinite',
                'reverse-spin': 'spin 25s linear infinite reverse',
            },
            keyframes: {
                glow: {
                    '0%': { boxShadow: '0 0 5px rgba(0, 243, 255, 0.2)' },
                    '100%': { boxShadow: '0 0 20px rgba(0, 243, 255, 0.6), 0 0 10px rgba(0, 243, 255, 0.4)' },
                }
            }
        },
    },
    plugins: [],
}
