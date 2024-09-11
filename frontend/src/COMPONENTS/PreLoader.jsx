import React from 'react'
import Logo from "../Assets/bitlinks logo.svg"
import BarLoader from "react-spinners/BarLoader"

export default function PreLoader() {
  return (
    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '20px'}}>
      <img src={Logo} alt="" style={{width: '300px'}}/>
      <BarLoader loading={true} color="#2867B2" size={30} width={190} height={5}/>
    </div>
  )
}