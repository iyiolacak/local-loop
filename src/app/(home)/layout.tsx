'use client';

import { useLiteMode } from "@/app/hooks/useLiteMode";


export default function Page({children}: {children: React.ReactNode}) {
  useLiteMode();
  return (
    <div className='w-full h-full'>
      <div className='h-full w-full'>{children}</div>
    </div>
  );
}
