<template>
    <nav>
        <div class="nav-wrapper navbar indigo darken-3">
            <router-link to="/" class="brand-logo"><i class="material-icons">check</i>Task manager</router-link>
            <ul id="nav-mobile" class="right hide-on-med-and-down">
                <router-link
                    v-for="link in links"
                    :key="link.url"
                    tag="li"
                    active-class="active"
                    :to="link.url"
                    :exact="link.exact"
                >
                    <a href="#">{{link.title}}</a>
                </router-link>
            </ul>
        </div>
    </nav>
</template>

<script>
export default {
    data: () => ({
        links: [
            {title: 'Create', url: '/', exact: true},
            {title: 'List', url: '/list'}
        ]
    })
}
</script>

<style lang="scss" scoped>
    .navbar {
        padding: 0 2rem;
    }

</style>