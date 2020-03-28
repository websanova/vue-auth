# Recipes




## Manually Authenticating and Setting a User

If the auto fetch needs to be disabled in favor of a manual approach.

Frist make sure to disable fetch in the plugin config.

```
Vue.use(auth, {
    ...    

    fetchData: {
        enabled: false
    }
});
```

To then set it manually call `setUser`.

```
$auth.setUser({
    id: 1,
    email: 'test@example.com',
    full_name: 'Rob Nova'
})
```


## Setting `staySignedIn` to false is broken when using `cookie` to store tokens.

This seems to be an issue with modern browsers simply ignoring standards with non persistent cookies.

Can read more about it on [StackOverflow](https://stackoverflow.com/questions/10617954/chrome-doesnt-delete-session-cookies).

Basically it's advised to better use session storage which is the default setting already.

As a "test", running Chrome in Incognito mode seems to produce the (correct) expected behaviour.