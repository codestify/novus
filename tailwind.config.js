/** @type {import('tailwindcss').Config} */
export default {
    content: ["./resources/**/*.blade.php", "./resources/**/*.{js,ts,jsx,tsx}"],
    darkMode: ["class", "class"],
    theme: {
    	extend: {
    		fontFamily: {
    			sans: [
    				'Instrument Sans',
    				'sans-serif'
    			]
    		},
    		colors: {
    			background: {
    				light: 'oklch(1 0 0)',
    				dark: 'oklch(0.145 0 0)'
    			}
    		},
    		keyframes: {
    			'accordion-down': {
    				from: {
    					height: '0'
    				},
    				to: {
    					height: 'var(--radix-accordion-content-height)'
    				}
    			},
    			'accordion-up': {
    				from: {
    					height: 'var(--radix-accordion-content-height)'
    				},
    				to: {
    					height: '0'
    				}
    			}
    		},
    		animation: {
    			'accordion-down': 'accordion-down 0.2s ease-out',
    			'accordion-up': 'accordion-up 0.2s ease-out'
    		}
    	}
    },
    plugins: [
        require("@tailwindcss/forms"),
        require("@tailwindcss/typography"),
    ],
};
