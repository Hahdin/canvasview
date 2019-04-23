import React, { useEffect } from 'react';
import {  rippleObject as _object } from '../objects'
export const Ripple = ({ ...props }) =>  {
  let canvas = null
  useEffect(() => {//did mount
    if (canvas) return
    canvas = _object.create()
    canvas.initCanvas()
    canvas.start()
    return () =>{//unmount
      myCleanup()
    }
  }, []);
  const myCleanup = () =>{
    if (!canvas) return
    canvas.cleanup()
  }
  return (<div className='container ' />)
}