import React from 'react'
import Banner from '@/app/components/home/banner'
import State from '@/app/components/home/states'
import About from '@/app/components/home/about'
import History from '@/app/components/home/history'
import LogisticTimeline from '@/app/components/home/logiaticTimeline'
import Service from '@/app/components/home/service'
import Ecommerce from '@/app/components/home/ecommerce'
import Price from '@/app/components/home/price'
import Shipping from '@/app/components/home/shipping'
import Warehouse from '@/app/components/home/warehouse'
import Facts from '@/app/components/home/facts'
import Industries from '@/app/components/home/industries'
import Blog from '@/app/components/home/blog'
import Quote from '@/app/components/home/quote'
import Partners from '@/app/components/home/partners'
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
      <Facts/>
      <Industries/>
      <Blog/>
      <Quote/>
      <Warehouse/>
      <Partners/>
    </div>
  )
}

export default page
