import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className="flex-none border-t px-6 py-4 text-sm text-muted-foreground bg-background/60 backdrop-blur-md">
      <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-y-3">
        <div className="*:font-regular flex flex-col sm:flex-row items-center gap-2 sm:gap-6">
          <span>© 2025 Locally Loop</span>
          <span>
            <a href="./LICENSE" className="underline hover:text-primary transition-colors">
              GPLv3 License
            </a>{' '}
            · @<span className="font-medium text-foreground"><Link href={"https://github.com/iyiolacak/"}>iyiolacak</Link></span>
          </span>
          <span>Privacy-first · Local-only</span>
        </div>
        <nav className="flex items-center gap-4" aria-label="Footer navigation">
          <a
            href="https://github.com/iyiolacak/local-loop"
            className="underline hover:text-primary transition-colors"
          >
            GitHub
          </a>
          <a href="./LICENSE" className="underline hover:text-primary transition-colors">
            License
          </a>
        </nav>
      </div>
    </footer>
  )
}

export default Footer
