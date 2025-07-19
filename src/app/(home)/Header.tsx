import { CommandForm } from '@/components/command-input/CommandForm';
import ProdAtLocalhostLogo from '@/components/Logo';
import React from 'react'

const Header = () => {
  return (
      <header className="sticky top-0 bg-background z-10 flex-none border-b">
        <div className="h-full px-3 md:px-8 mx-auto max-w-full flex items-center justify-between">
          {/* Logo – keeps intrinsic width */}
          <div className="hidden md:block flex-shrink-0">
            <ProdAtLocalhostLogo />
          </div>

          {/* Command bar – grows, stays cetred, never shrinks below its content */}
          <div className="flex-1 h-full flex py-4 items-center justify-center">
            {/* THIS PARENT DIV IS WHERE AUDIO VISUALIZER SHOULD BE REFLECTED TO */}
            <div
              className="max-h-full w-full md:w-1/2"
            //   ref={audioVisualizerRef}
            >
              <CommandForm
                onSubmit={(value) => {
                  console.log("Command submitted:", value);
                }}
              />
            </div>
          </div>
        </div>
      </header>
  )
}

export default Header