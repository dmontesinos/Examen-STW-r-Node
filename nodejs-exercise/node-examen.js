function interruptablePromise(p){

  var o = (function() {
    let llamado = false;

    return {
      q: new Promise(function(resolve, reject){
        p.then(function(valor) {
          if(!llamado){
            resolve(valor);
          }
        }).catch(function(valor){
          reject(valor);
        })
      }),

      disable: function(){
        if(!llamado){
          llamado = true;
        }
      }
    }
  })();
  return o;
}






// Some tests

const resolveIn = (v, t) => new Promise((resolve, reject) =>
                                          setTimeout(() => resolve(v), t));
const rejectIn = (v, t) => new Promise((resolve, reject) =>
                                         setTimeout(() => reject(v), t));

var o = interruptablePromise(Promise.resolve(1));
o.q.then(console.log); // Result: 1

var o = interruptablePromise(Promise.reject(2));
o.q.catch(console.log); // Result: 2

var o = interruptablePromise(resolveIn(3, 10));
o.q.then(console.log); // Result: 3

var o = interruptablePromise(resolveIn(4, 10));
o.disable();
o.q.then(console.log); // (nothing is printed)

var o = interruptablePromise(rejectIn(5, 10));
o.disable();
o.q.catch(console.log); // Result: 5

var o = interruptablePromise(Promise.resolve(6));
o.disable();
o.q.then(console.log); // (nothing is printed)

// Your tests here...
