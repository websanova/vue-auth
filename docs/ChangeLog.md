# Change Log


- remember me fixes
- register
- admin (users) (impersonating \w toggles).
- docs
- issues
- sponsors
- oauth (breaking change).
- manual login then refresh should toss user on 401?



## 3.0.0-beta

* There are no more success/error callback functions, instead use a promise.






## Drivers

### No more underscore prefix on driver functions.

This applies to `http` and `router` drivers.

### http function needs to return a promise.

This should already apply but note that it no longer process error/success callbacks.







everything changed to proper es6 module imports (check this)



ready no longer accept a function, use $auth.load().then() promise instead.






