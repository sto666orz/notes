<template>
    <div>
        <p class="text">{{ text }}</p>
    </div>
</template>

<script>

export default {
  setup() {
    return {
      text: 'text'
    }
  }
}

</script>

<style scoped>
.text {
  font-size: 20px;
  width: 375px;
  height: 200px;
  line-height: 200px;
  /* border: 1px solid red; */
  background-color: rosybrown;
}
</style>