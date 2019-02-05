<template>
	<div class="configuration">
		<Containers :containers="containers" />
		<ItemGroups :groups="groups" />
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Card from "../Card.vue";
import Containers from "./Containers.vue";
import ItemGroups from "./ItemGroups.vue";
import SettingsIcon from "icons/Settings.vue";
import CloseIcon from "icons/Close.vue";

export interface Container {
	id: number;
	dim1: number;
	dim2: number;
	dim3: number;
}
export interface Item extends Container {
	color: string;
}
export interface ItemGroup {
	id: number;
	name: string;
	priority: number;
	color: string;
	items: Item[];
}

@Component({
	components: {
		Card,
		Containers,
		ItemGroups,
		SettingsIcon,
		CloseIcon
	}
})
export default class Configuration extends Vue {
	public containers: Container[] = [];
	public groups: ItemGroup[] = [];
}
</script>

<style lang="scss">
.configuration {
	height: 100%;
	overflow: auto;
	position: relative;

	.card {
		min-height: 6.5em;
	}
	table {
		border-collapse: collapse;
		width: 100%;
		th {
			font-weight: normal;
			font-size: 0.9em;
		}
		th,
		td {
			padding: 0 0.75em 0.75em 0;
		}
	}
	input {
		border: 2px solid white;
		&[type="number"] {
			width: 4.5em;
		}
	}
}
.subtle {
	opacity: 0.6;
}
</style>
