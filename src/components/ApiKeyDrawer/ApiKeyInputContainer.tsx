import React from 'react'
import { Input } from '../ui/input'

const ApiKeyInputContainer = () => {
  return (
    <div className='w-full h-full flex flex-col'>
        <div className='flex-1 overflow-y-auto'>
            <Input
                className='w-full h-12'
                placeholder='Enter your API key here...'
                type='text'
                autoFocus
                onChange={(e: any) => {
                    // Handle input change logic here
                    }}
                />
                </div>

    </div>
  )
}

export default ApiKeyInputContainer