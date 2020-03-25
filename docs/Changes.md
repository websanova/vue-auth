
# ToDo

- get demo working (new)
- start setting up docs (clean).
- 









## Drivers

### No more underscore prefix on driver functions.

This applies to `http` and `router` drivers.

### http function needs to return a promise.

This should already apply but note that it no longer process error/success callbacks.



No more success/error functions, everything returns a promise.



everything changed to proper es6 module imports (check this)



ready no longer accept a function, use $auth.load().then() promise instead.