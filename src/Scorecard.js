import React from 'react'
import Batsman from './Batsman'
import Bowler from './Bowler'

export default function Scorecard() {
  return (
    <div>
      <h1>This is total scorecard</h1>
      <div className="container ">

        <div className='row justify-content-center'>
          <div className='col-md-6 mt-5'>
            <Batsman />
          </div>
        </div>
        <div className='row justify-content-center'>
          <div className='col-md-6 mt-5'>
            <Bowler />
          </div>
        </div>

      </div>

    </div>
  )
}
