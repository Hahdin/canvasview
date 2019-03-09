function addressLengthWrong(address) {
  let keys = ['street', 'city', 'state', 'zip']
  return keys.reduce((acc, key) => acc += (address[key]) ? address[key].length : 0, 0)
  //return keys.reduce((acc, key) => address[key] ? acc + address[key].length : acc + 0, 0)
}

let address = {
  street: 'My Street',
  city: '',
  state: '',
  zip: ''
}
//console.log(`wrong address len ${addressLengthWrong(address)}`)

address.zip = '01234'
//console.log(`wrong address len ${addressLengthWrong(address)}`)

let a = 1, b = 2
let c = 0
c += a === 1 ? a : b
//console.log(c)


let x = 8192
let xx =  8192 >>> 1
let hex = x.toString(16);
let bin = x.toString(2);
let b2 = (x >>> 0).toString(2);
let t = x >> 1
//console.log(x,hex, bin, b2, t) 

//let mask = 1 << 7
//console.log(mask)
// if ((n & mask) != 0) {
//   // bit is set
// } else {
//   // bit is not set
// }

const encode = Number =>{
  let mask = 1 << 7
  let h = ((Number >> 7) & 0xff)//14 bit, high
  let l = Number  & 0xff//14 bit, low
  h = (h << 1) & 0xff//shift high
  l = l &= ~mask  //mask low
  let encoded =  (((h & 0xff) << 7) | (l & 0xff)).toString(16)//combine and convert to hex
  return encoded
}
const unencode = Number =>{
  let i = parseInt(Number, 16)//get the int
  let h = ((i >> 7) & 0xff)//split it
  let l = i & 0xff
  h = (h >> 1) & 0xff//shift right
  l = (l) & 0xff
  let orgNumber = (((h & 0xff) << 7) | (l & 0xff))//combine
  return orgNumber
}

let offset = 8192
let orgNumber = -4096
let encodedValue = encode(orgNumber + offset)
let unencodedValue = unencode(encodedValue) 
console.log(`original: ${orgNumber}, encoded: ${encodedValue}, decoded: ${unencodedValue - offset} `)



// var firstNumber = 8192; // extracted from Uint16Array

// var high = ((firstNumber >> 7) & 0xff)
// var low = firstNumber & 0xff;

// //most significant is the 7th
// let newH = (high << 1) & 0xff
// let newL = low &= ~mask
// let newDecimal = (((newH & 0xff) << 7) | (newL & 0xff));
// let newHex = newDecimal.toString(16)

// //high = high | (1 << 8)
// //low = low | (1 << 8)
// let hhex = high.toString(16)

// console.log(high, low, newH,newL, newDecimal, newHex); // 4, 94


// //change back now
// //1 convert hex to dec
// let encInt = parseInt(newHex, 16)
// high = ((encInt >> 7) & 0xff)
// low = encInt & 0xff

// let orgLow = (low >> 1) & 0xff


// let orgHigh = (high >> 1) & 0xff
// //mask = 1 << 0
// //orgLow |= mask



// console.log(`
// new dec: ${encInt}
// enc high: ${high}
// enc low: ${low}
// reverted high: ${orgHigh}
// reverted low: ${orgLow}
// `)
// let orgNumber = (((orgHigh & 0xff) << 7) | (orgLow & 0xff));


// //console.log((high >>> 0).toString(2), (low >>> 0).toString(2))
// //return number | (1 << bitPosition)
// //var maskH = (high & 0xff) << 8; // gets the 8th bit
// //var maskL = (low & 0xff) << 8; // gets the 8th bit

// //var _firstNumber = (((high & 0xff) << 8) | (low & 0xff));

// console.log(orgNumber); // 1118