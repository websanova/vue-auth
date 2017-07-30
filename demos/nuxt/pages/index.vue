<template>
    <div>
        Hello {{ $auth.ready() ? 'true' : 'false' }}
    </div>
</template>