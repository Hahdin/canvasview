import React, { useEffect } from 'react';
import {  transformObject } from '../objects'
export const Transform = ({ ...props }) =>  {
  let canvas = null
  useEffect(() => {//did mount
    if (canvas) return
    canvas = transformObject.create()
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
