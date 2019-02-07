<template>
	<div class="configuration">
		<Containers :containers="containers"
		            :style="{flexShrink: 0, maxHeight: '30vh'}" />
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
import state from "@/state";

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
	private get containers() {
		return state.containers;
	}
	private get groups() {
		return state.groups;
	}
}
</script>

<style lang="scss">
.configuration {
	height: 100%;
	overflow: hidden;
	display: flex;
	flex-direction: column;

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
