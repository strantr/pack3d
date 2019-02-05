<template>
  <div id="app">
    <Sidebar>
      <Configuration/>
    </Sidebar>
    <div class="canvas">
      <div class="canvas__body">ayy</div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Sidebar from "./components/Sidebar/Sidebar.vue";
import Configuration from "./components/Sidebar/Configuration.vue";

@Component({
	components: {
		Configuration,
		Sidebar
	}
})
export default class App extends Vue {}
</script>

<style lang="scss">
#app {
	color: rgba(255, 255, 255, 0.87);
	display: flex;
	flex-wrap: wrap;
}
.canvas {
	background: linear-gradient(#eee, #fff 80%);
	flex: auto;
	&__body {
		padding: 15px;
	}
}
</style>
