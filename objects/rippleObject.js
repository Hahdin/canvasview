const dat = require('dat.gui');
import { lib } from '../helpers/'
import parentObject from './parentObject'
import { LoadingManager } from 'three';
export const rippleObject = {
   innerWidth: 0,
   innerHeight: 0,
   ctx: null,
   canvas: null,
   gui: null,
   drawTime: 60,
   drawTimer: null,
   randTimer: null,
   frameTimer: null,
   //specific stuff
   half_width: 0,
   half_height: 0,
   line_width: 20,
   step: 0,
   count: 0,
   oldind: 0,
   newind: 0,
   riprad: 3,
   ripplemap: [],
   last_map: [],
   ripple: 0,
   texture: 0,
   lastdx: -1,
   lastdy: -1,
   shift: 5,
   z: 1,
   size: 0,
   loaded: false,
   img: null,

   cleanup() {
      this.gui.destroy()
      this.stop();
   },
   addGui() {
      let controller = {
      }
   },
   initData() {
      this.half_width = this.innerWidth >> 1,
         this.half_height = this.innerHeight >> 1,
         this.line_width = 20,
         this.step = this.line_width * 2,
         this.count = this.innerHeight / this.line_width;
      this.oldind = this.innerWidth,
         this.newind = this.innerWidth * (this.innerHeight + 3),
         this.riprad = 3,
         this.ripplemap = [],
         this.last_map = [],
         this.ripple = 0,
         this.texture = 0,
         this.lastdx = -1,
         this.lastdy = -1,
         this.shift = 5;
      this.z = 1;
      this.size = this.innerWidth * (this.innerHeight + 2) * 2;
      this.canvas.onmousemove = (/* Event */ evt) => {
         this.disturb(evt.offsetX || evt.layerX, evt.offsetY || evt.layerY);
      };

      this.img = new Image(500,500);
      this.img.src = 'ripple.jpg'

      // let grad = this.ctx.createLinearGradient(0, 0, 0, this.innerHeight);
      // grad.addColorStop(0, "white");
      // grad.addColorStop(0.2, "blue");
      // grad.addColorStop(0.4, "blueviolet");
      // grad.addColorStop(0.6, "blue");
      // grad.addColorStop(0.8, "blueviolet");
      // grad.addColorStop(1, "white  ");
      // this.ctx.fillStyle = grad;
      // this.ctx.fillRect(0, 0, this.innerWidth, this.innerHeight);
      for (var i = 0; i < this.size; i++) {
         this.last_map[i] = this.ripplemap[i] = 0;
      }
      // this.ctx.putImageData(this.ripple, 0, 0);

		// this.randTimer = setInterval(() => {
		// 	this.disturb(Math.random() * this.innerWidth, Math.random() * this.innerHeight);
		// }, 1000);		


   },
   loadImage(){
      this.ctx.drawImage(this.img, 0,0);
      this.texture = this.ctx.getImageData(0, 0, this.innerWidth, this.innerHeight);
      this.ripple = this.ctx.getImageData(0, 0, this.innerWidth, this.innerHeight);

   },
   initCanvas() {
      this.canvas = document.getElementById("canvas")
      this.innerHeight = this.canvas.innerHeight = this.canvas.height = 600
      this.innerWidth = this.canvas.innerWidth = this.canvas.width = 600
      this.ctx = this.canvas.getContext("2d")
      this.gui = new dat.GUI({ width: 310 })
      this.addGui()
      this.initData()
   },
   draw() {
      console.log('draw')
      if (!this.loaded){
         this.loaded = true;
         this.loadImage()
         return;
      }
      //this.newFrame();
      this.ctx.putImageData(this.ripple, 0, 0);
   },
   newFrame() {
      let a, b, data, cur_pixel, new_pixel, old_data;
      let t = this.oldind; this.oldind = this.newind; this.newind = t;
      let i = 0;
      let _width = this.innerWidth,
         _height = this.innerHeight,
         _ripplemap = this.ripplemap,
         _last_map = this.last_map,
         _rd = this.ripple.data,
         _td = this.texture.data,
         _half_width = this.half_width,
         _half_height = this.half_height;
      for (let y = 0; y < _height; y++) {
         for (let x = 0; x < _width; x++) {
            let _newind = this.newind + i, _mapind = this.oldind + i;
            data = (
               _ripplemap[_mapind - _width] +
               _ripplemap[_mapind + _width] +
               _ripplemap[_mapind - 1] +
               _ripplemap[_mapind + 1]) >> 1;

            data -= _ripplemap[_newind];
            this.shift++;
            if (this.shift > 10)
               this.shift = 5;
            data -= data >> this.shift;
            _ripplemap[_newind] = data;
            //where data = 0 then still, where data > 0 then wave
            data = 1024 - data;
            old_data = _last_map[i];
            _last_map[i] = data;
            if (old_data != data) {
               //offsets
               a = (((x - _half_width) * (data) / 1024) << 0) + _half_width;
               b = (((y - _half_height) * (data) / 1024) << 0) + _half_height;
               //bounds check
               if (a >= _width) a = _width - 1;
               if (a < 0) a = 0;
               if (b >= _height) b = _height - 1;
               if (b < 0) b = 0;
               new_pixel = (a + (b * _width)) * 4;
               cur_pixel = i * 4;
               _rd[cur_pixel] = _td[new_pixel];
               _rd[cur_pixel + 1] = _td[new_pixel + 1];
               _rd[cur_pixel + 2] = _td[new_pixel + 2];
            }
            ++i;
         }
      }

   },
   disturb(dx, dy) {
      dx <<= 0;
      dy <<= 0;
      this.riprad++;
      if (this.riprad > 6)
         this.riprad = 3;
      for (let j = dy - this.riprad; j < dy + this.riprad; j++) {
         for (let k = dx - this.riprad; k < dx + this.riprad; k++) {
            let dlx = k - dx;
            let dly = j - dy;
            this.DepthMap(dlx, dly);
            this.ripplemap[this.oldind + (j * this.innerWidth) + k] += (64 * this.z) << 0;
         }
      }
   },
   DepthMap(dx, dy) {
      let wave = 8;
      let train = 3.4;
      let r = (Math.sqrt(dx * dx + dy * dy) - this.riprad) / wave;
      let n = r - (1 - 1.5) * this.riprad / wave;
      this.z = (1 / (1 + (r / train) * (r / train))) * (Math.sin(n * 2 * 3.14159));
      this.z *= 31.4159;
   },
   start() {
      this.drawTimer = setInterval(() => { this.draw() }, this.drawTime)
      this.frameTimer = setInterval(() => {this.newFrame() }, 60)
   },
   stop() {
      clearInterval(this.drawTimer);
      clearInterval(this.randTimer);
      clearInterval(this.frameTimer);
      
   },
   create() {
      return { ...parentObject, ...this }
   },
}
export default rippleObject
