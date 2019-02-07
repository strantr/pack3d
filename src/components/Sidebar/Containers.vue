<template>
	<card title="Containers">
		<div slot="title--after"
		     class="card__header__buttons">
			<PlusIcon title="Add new container"
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
						<td>
							<input style="width: 100%">
						</td>
						<td>
							<input type="number"
							       v-model="container.dim1">
						</td>
						<td>
							<input type="number"
							       v-model="container.dim2">
						</td>
						<td>
							<input type="number"
							       v-model="container.dim3">
						</td>
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
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import Card from "../Card.vue";
import { Container } from "@/models";
import PlusIcon from "icons/Plus.vue";
import CloseIcon from "icons/Close.vue";

@Component({
	components: {
		Card,
		PlusIcon,
		CloseIcon
	}
})
export default class Containers extends Vue {
	@Prop({ required: true }) public containers!: Container[];
	private containerId: number = 1;

	public addContainer() {
		this.containers.push({
			id: this.containerId++,
			dim1: 0,
			dim2: 0,
			dim3: 0
		});
	}
}
</script>
