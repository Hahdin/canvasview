import React, { useEffect } from 'react';
import {  GOLObject } from '../objects'
export const TheGame = ({ ...props }) =>  {
  let canvas = null
  useEffect(() => {//did mount
    if (canvas) return
    canvas = GOLObject.create()
    canvas.initCanvas()
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
