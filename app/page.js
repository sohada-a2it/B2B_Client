import React from 'react'
import Banner from '@/app/components/banner'
import State from '@/app/components/states'
import About from '@/app/components/about'
import History from '@/app/components/history'
function page() {
  return (
    <div>
      <Banner /> 
      <State/>
      <About/> 
      <History/>
    </div>
  )
}

export default page
