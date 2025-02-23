import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

export default function CallsComponent() {
  return (
    <div className='rounded-md bg-white p-[10px]'>
      <h4><FontAwesomeIcon icon={faClockRotateLeft} /> Call Histroy</h4>
    </div>
  )
}
