'use client';


export default function Page({children}: {children: React.ReactNode}) {

  return (
    <div className='w-full h-full'>
      <div className='h-full w-full'>{children}</div>
    </div>
  );
}
