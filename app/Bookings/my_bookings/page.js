import React from 'react'
import CreateBooking from "@/components/booking/createBooking"
import MyBooking from "@/components/booking/myBooking"
function page() {
  return (
    <div>
      <CreateBooking/>
      <MyBooking/>
    </div>
  )
}

export default page