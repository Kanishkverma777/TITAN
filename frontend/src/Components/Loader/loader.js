import React from 'react'

const Loader = () => {
  return (
    <div className='flex justify-center items-center py-20 w-full'>
        <div className='w-14 h-14 border-[3px] border-titan-lime/20 border-t-titan-lime rounded-full animate-spin'></div>
    </div>
  )
}

export default Loader