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
console.log(`wrong address len ${addressLengthWrong(address)}`)

address.zip = '01234'
console.log(`wrong address len ${addressLengthWrong(address)}`)

let a = 1, b = 2
let c = 0
c += a === 1 ? a : b
console.log(c)