# Routing

### auth: `true`

* User must be authenticated (no roles are checked).

### auth: `false`

* If the user is logged in then this route will be unavailable. Useful for login/register type pages to be unaccessible once the user is logged in.

### auth: `undefined`

* Public, no checks required.

### auth: `Array` `String`

* The user must be logged in. Additionally the string or array will be checked against the users roles.
* Note that the users `roles` variable can be set in the options.

### auth: `Object`

* The user must be logged in and the object will be checked against the users roles.
* Note for this to work both the auth and user roles must both be objects.
* An object must also be used when using `$auth.check({some: 'name'})` where the value can be a `String` or `Array`.
