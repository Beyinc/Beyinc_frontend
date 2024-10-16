import React from 'react'
import BoxCategories from './BoxCategories'

const EntryDetails = () => {
  return (
    // bg-customWhite
    <div className='bg-customWhite my-5 mx-20 shadow-[0_3px_12px_rgba(0,0,0,0.1)]'>
        <div className='flex flex-col py-10 px-20'>
            <h2 className='font-bold mb-5 pl-6'>Tell us who you are?</h2>
            <BoxCategories  />
        </div>
    </div>
  )
}

export default EntryDetails