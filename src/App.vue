<template>
	<div id="app">
		<Sidebar>
			<Configuration />
		</Sidebar>
		<Canvas />
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Sidebar from "./components/Sidebar/Sidebar.vue";
import Canvas from "./components/Canvas.vue";
import Configuration from "./components/Sidebar/Configuration.vue";

@Component({
	components: {
		Configuration,
		Sidebar,
		Canvas
	}
})
export default class App extends Vue {}
</script>

<style lang="scss">
#app {
	color: rgba(255, 255, 255, 0.87);
	display: flex;
	flex-wrap: wrap;
	min-height: 100vh;
}
</style>
