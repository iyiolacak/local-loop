import React from 'react'

const Footer = () => {
  return (
        <footer className="flex-none h-10 border-t text-sm flex items-center justify-center px-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <span>© 2025 Local Loop</span>
            <span>MIT License (MIT © iyiolacak)</span>
            <span>Privacy-first &amp; local-only</span>
          </div>
          <div className="flex items-center gap-4 ml-6">
            <a
              href="https://github.com/iyiolacak/local-loop"
              className="underline hover:text-primary"
            >
              GitHub
            </a>
            <a href="./LICENSE" className="underline hover:text-primary">
              License
            </a>
          </div>
        </footer>
  )
}

export default Footer