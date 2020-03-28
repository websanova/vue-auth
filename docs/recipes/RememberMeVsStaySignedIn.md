


This has been changed to better reflect security concerns and modern use of things like password managers.

Because the plugin does not force the usage of cookies but allows multiple storage methods, cookies, session storage, local storage.

Also the plugin is designed with SPA in mind which means the typical use case is with some kind of token that is reused on subsequent requests. This means they "stay signed in" is on by default unless the app explicityly removes it.

That tokens lifespan is then managed by the api/service not the front ends responsibility.

However this creates issues on the different between a refresh or closing the browser all together which behaves differently between cookies, and local/session storage.



Currenlty there is no way to tell the difference between a refresh/close.

If we store in item storage we can remove it on refresh/close, BUT that means the cookie is already there and therefore defeats the purpose and makes things insecure. We can for instance hijack any stored password or token by disabling javascript and inspecing storage, etc.


local storage does not have expiration.