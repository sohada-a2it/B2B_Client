import React from 'react'
import Banner from '@/app/components/banner'
import State from '@/app/components/states'
import About from '@/app/components/about'
import History from '@/app/components/history'
import LogisticTimeline from '@/app/components/logiaticTimeline'
import Service from '@/app/components/service'
import Ecommerce from '@/app/components/ecommerce'
import Price from '@/app/components/price'
import Shipping from '@/app/components/shipping'
import Warehouse from '@/app/components/warehouse'
import Facts from '@/app/components/facts'
import Industries from '@/app/components/industries'
function page() {
  return (
    <div>
      <Banner /> 
      <State/>
      <About/> 
      <History/>
      <LogisticTimeline/>
      <Service/>
      <Ecommerce/>
      <Price/>
      <Shipping/>
      <Warehouse/>
      <Facts/>
      <Industries/>
    </div>
  )
}

export default page
