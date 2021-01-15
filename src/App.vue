<template>
  <div id="app">
    <Navbar />
    <div class="row">
      <div class="col s12">
        <div class="container">
          <div class="content-wrapper">
            <router-view/>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from '@/components/Navbar'

export default {
  name: 'app',
  components: {
    Navbar
  }
}
</script>

<style lang="scss">
@import '~materialize-css/dist/css/materialize.min.css';

*,
*::before,
*::after {
  box-sizing: border-box;
}

h1, h2, h3, h4, h5, h6, p {
  margin: 0;
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

.title-1 {
  margin-bottom: 3rem;
}

.button-icon-m-0 {
  margin: 0 !important;
}

.content-wrapper {
  padding: 3rem 0;
}

.helper-text.invalid {
  color: #F44336
}

.pagination li.active {
    background-color: #303f9f;
}

.pagination li.active a {
    color: #fff;
}

</style>
