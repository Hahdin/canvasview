import React, { useEffect } from 'react';
import {  navier } from '../objects'
export const Turb = ({ ...props }) =>  {
  let canvas = null
  useEffect(() => {//did mount
    if (canvas) return
    canvas = navier.create()
    canvas.initCanvas()
    canvas._fill('rgba(0,0,0, 1)', 0, 0)
    canvas.start()
    return () =>{//unmount
      myCleanup()
    }
  }, []);

  const myCleanup = () =>{
    if (!canvas) return
    canvas.cleanup()
    canvas.stop()
  }
  return (<div className='container ' />)
}
