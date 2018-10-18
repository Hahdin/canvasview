
let parent = {
  a: '1',
  b: '2',
  test(){
    return 'parent test'
  },
  greet(){
    return 'Parent>> hello'
  },
  create(){
    return Object.assign(Object.create(this))
  }
}

let child1 = {
  c: '3',
  test(){
    return 'child1 test'
  },
}
let child2 = {
  c: '4',
  d: 7,
  test(){
    return 'child2 test'
  },
  greet(){
    return 'child2>> Hi There'
  },
}


let myObject = Object.assign(parent.create(), child1)
let myObject2 = Object.assign(parent.create(), child2)


const trace = label => value => {
  console.log(`${ label }: ${ value }`);
  return value;
};
const pipe = (...fns) => x => fns.reduce((y, f) => f(y), x);
pipe(
  trace('myObject:test')(myObject.test()), 
  trace('myObject:greet')(myObject.greet()),
  trace('myObject2:test')(myObject2.test()), 
  trace('myObject2:greet')(myObject2.greet()),
  )
