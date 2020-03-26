<template>
    <div>
        <div>
            {{ $route.name.split('-').join(' / ') }}

            <span class="pull-right">
                {{ $auth.user().first_name }}
            </span>
        </div>

        <hr />

        <router-view />
    </div>
</template>