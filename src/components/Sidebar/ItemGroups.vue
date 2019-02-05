<template>
	<card title="Item Groups">
		<div slot="title--after"
		     class="card__header__buttons">
			<PlusIcon title="Add new group"
			          class="button"
			          @click.native="addGroup" />
		</div>
		<div class="groups">
			<template v-if="groups.length">
				<card class="group"
				      v-for="group in groups"
				      :key="group.id">
					<template slot="header">
						<input v-if="editingGroup===group"
						       class="group__name"
						       v-model="group.name"
						       v-mount-focus.select
						       @blur="editingGroup=null">
						<span class="group__name"
						      @click="editingGroup=group"
						      v-else>{{group.name}}
							<PencilIcon style="font-size: .75em" /></span>

						<div class="card__header__buttons">
							<PaletteIcon :style="{color: group.color}" />
							<input type="number"
							       placeholder="Priority" />
							<CloseIcon class="button" />
						</div>
					</template>

					<table class="grid"
					       v-if="group.items.length">
						<thead>
							<th>Colour</th>
							<th style="text-align: left; width: 100%">Name</th>
							<th>Width</th>
							<th>Height</th>
							<th>Length</th>
							<th></th>
						</thead>
						<tbody>
							<tr v-for="(item, i) in group.items"
							    :key="item.id">
								<td></td>
								<td>
									<input style="width: 100%">
								</td>
								<td>
									<input type="number"
									       v-model="item.dim1">
								</td>
								<td>
									<input type="number"
									       v-model="item.dim2">
								</td>
								<td>
									<input type="number"
									       v-model="item.dim3">
								</td>
								<td>
									<CloseIcon class="button"
									           @click.native="group.items.splice(i,1)" />
								</td>
							</tr>
						</tbody>
					</table>
					<div class="subtle"
					     v-else>Add some items!</div>
				</card>
			</template>
			<div class="subtle"
			     v-else>Add some groups!</div>
		</div>
	</card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import randomColor from "randomcolor";
import Card from "../Card.vue";
import { ItemGroup } from "./Configuration.vue";
import PlusIcon from "icons/Plus.vue";
import CloseIcon from "icons/Close.vue";
import PencilIcon from "icons/Pencil.vue";
import PaletteIcon from "icons/Palette.vue";

@Component({
	components: {
		Card,
		PlusIcon,
		CloseIcon,
		PencilIcon,
		PaletteIcon
	},
	directives: {
		"mount-focus": {
			inserted(el, binding) {
				el.focus();
				if (binding.modifiers.select) {
					(el as HTMLInputElement).select();
				}
			}
		}
	}
})
export default class ItemGroups extends Vue {
	@Prop({ required: true }) public groups!: ItemGroup[];
	public editingGroup: ItemGroup | null = null;
	private groupId: number = 1;
	private colors: string[] = [];

	public addGroup() {
		const c = this.getNextColor();
		const g: ItemGroup = {
			id: this.groupId,
			name: "Group " + this.groupId++,
			color: c,
			priority: 1,
			items: [
				{
					color: c,
					id: 1,
					dim1: 0,
					dim2: 0,
					dim3: 0
				}
			]
		};
		this.groups.push(g);
		this.editingGroup = g;
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
.groups {
	> .group:first-child {
		margin-top: 0em;
	}
}
.group {
	background: rgba(255, 255, 255, 0.15);
	input.group__name {
		font-size: 0.9em;
		padding: 0;
		border: 0;
	}
	span.group__name {
		cursor: text;
		font-size: 0.9em;
	}
	.card__header__buttons input {
		padding: 0 0.25em;
		width: 5em;
	}
}
</style>

