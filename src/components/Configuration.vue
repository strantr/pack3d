<template>
	<div class="configuration">
		<card title="Containers">
			<div slot="title--after"
			     class="card__header__buttons">
				<ShapeSquarePlusIcon title="Add new container"
				                     class="button"
				                     @click.native="addContainer" />
			</div>
			<div>
				<table class="grid"
				       v-if="containers.length">
					<thead>
						<th style="text-align: left; width: 100%">Name</th>
						<th>Width</th>
						<th>Height</th>
						<th>Length</th>
						<th></th>
					</thead>
					<tbody>
						<tr v-for="(container, i) in containers"
						    :key="container.id">
							<td><input style="width: 100%" /></td>
							<td><input type="number"
								       v-model="container.dim1" /></td>
							<td><input type="number"
								       v-model="container.dim2" /></td>
							<td><input type="number"
								       v-model="container.dim3" /></td>
							<td>
								<CloseIcon class="button"
								           @click.native="containers.splice(i,1)" />
							</td>
						</tr>
					</tbody>
				</table>
				<div class="subtle"
				     v-else>Add some containers!</div>
			</div>
		</card>
		<card title="Items">
			<div slot="title--after"
			     class="card__header__buttons">
				<ShapeSquarePlusIcon title="Add new item"
				                     class="button"
				                     @click.native="addItem" />
			</div>
			<div>
				<table class="grid"
				       v-if="items.length">
					<thead>
						<th>Color</th>
						<th style="text-align: left">Name</th>
						<th>Width</th>
						<th>Height</th>
						<th>Length</th>
						<th>Priority</th>
						<th></th>
					</thead>
					<tbody>
						<tr v-for="(item, i) in items"
						    :key="item.id">
							<td>
								<div class="item-color"
								     :style="{background: item.color}" />
							</td>
							<td><input /></td>
							<td><input type="number"
								       v-model="item.dim1" /></td>
							<td><input type="number"
								       v-model="item.dim2" /></td>
							<td><input type="number"
								       v-model="item.dim3" /></td>
							<td><input type="number"
								       v-model="item.dim3" /></td>
							<td>
								<CloseIcon class="button"
								           @click.native="items.splice(i,1)" />
							</td>
						</tr>
					</tbody>
				</table>
				<div class="subtle"
				     v-else>Add some items!</div>
			</div>
		</card>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import randomColor from "randomcolor";
import Card from "./Card.vue";
import ShapeSquarePlusIcon from "icons/ShapeSquarePlus.vue";
import SettingsIcon from "icons/Settings.vue";
import CloseIcon from "icons/Close.vue";

interface Container {
	id: number;
	dim1: number;
	dim2: number;
	dim3: number;
}
interface Item extends Container {
	color: string;
	priority: number;
}
@Component({
	components: {
		Card,
		ShapeSquarePlusIcon,
		SettingsIcon,
		CloseIcon
	}
})
export default class Configuration extends Vue {
	public containers: Container[] = [];
	public items: Item[] = [];
	private containerId: number = 1;
	private itemId: number = 1;
	private colors: string[] = [];

	public addContainer() {
		this.containers.push({
			id: this.containerId++,
			dim1: 0,
			dim2: 0,
			dim3: 0
		});
	}
	public addItem() {
		this.items.push({
			id: this.itemId++,
			dim1: 0,
			dim2: 0,
			dim3: 0,
			priority: 1,
			color: this.getNextColor()
		});
	}
	private getNextColor() {
		if (!this.colors.length) {
			this.colors.push(...randomColor({ count: 10 }));
		}
		return this.colors.pop()!;
	}
}
</script>

<style lang="scss" scoped>
.configuration {
	display: flex;
	flex-direction: column;
	.card {
		min-height: 6.5em;
	}
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
.subtle {
	opacity: 0.6;
}
.item-color {
	width: 1em;
	height: 1em;
	margin: 0 auto;
}
</style>
