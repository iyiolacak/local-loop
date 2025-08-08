import React from 'react'

const TextAreaContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex w-full max-w-2xl">
      {/* Text input container */}
      <div className="w-full">
        {children}
      </div>
    </div>
  )
}

export default TextAreaContainer