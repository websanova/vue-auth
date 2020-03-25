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