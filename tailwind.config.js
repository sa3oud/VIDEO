module.exports = {
 content: [
   "./src/**/*.{js,jsx,ts,tsx}",
   "./public/index.html"
 ],
 theme: {
   extend: {
     animation: {
       pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
     },
     keyframes: {
       pulse: {
         '0%, 100%': { opacity: 1 },
         '50%': { opacity: .5 }
       }
     }
   },
 },
 plugins: [],
 variants: {
   extend: {
     opacity: ['disabled'],
     cursor: ['disabled'],
   }
 }
}
