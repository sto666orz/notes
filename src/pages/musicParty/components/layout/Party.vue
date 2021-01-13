<template>
  <div class="party-wrap">
    <div class="party-main">
      <div class="party-over">
        <div class="stage">
          <slot name="stage"></slot>
        </div>
        <div class="bottom">
          <slot name="bottom"></slot>
        </div>
      </div>
    </div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  //
}
</script>

<style lang="scss" scoped>
.party-wrap {
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  max-width: 750px;
  height: 100%;
  margin: 0 auto;

  user-select: none;
  touch-action: none;

  .party-main {
    position: absolute;
    top: 988px;
    left: 0;
    right: 0;
    bottom: 0;
  }
}

.party-over {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  min-height: 344px;
  height: 100%;
  .stage {
    position: absolute;
    top: -988px;
    left: 0;
    right: 0;
    height: 988px;
  }
  .bottom {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
}
</style>
