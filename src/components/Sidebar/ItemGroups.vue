<template>
  <card title="Item Groups">
    <div slot="title--after" class="card__header__buttons">
      <PlusIcon title="Add new group" class="button" @click.native="addGroup"/>
    </div>
    <div class="groups">
      <template v-if="groups.length">
        <card
          class="group"
          v-for="(group, i) in groups"
          :key="group.id"
        >
          <template slot="header">
            <input
              v-if="editingGroup===group"
              class="group__name"
              v-model="group.name"
              v-mount-focus.select
              @blur="editingGroup=null"
            >
            <span class="group__name" @click="editingGroup=group" v-else>
              {{group.name}}
              <PencilIcon style="font-size: .75em"/>
            </span>

            <div class="card__header__buttons">
              <PaletteIcon
                class="button shadow"
                :style="{color: group.color}"
                @click.native="showColorPicker"
              />
              <input type="color" v-model="group.color" style="display: none">
              <input type="number" placeholder="Priority">
              <CloseIcon class="button" @click.native="groups.splice(i,1)"/>
            </div>
          </template>

          <table class="grid" v-if="group.items.length">
            <thead>
              <th>Colour</th>
              <th style="text-align: left; width: 100%">Name</th>
              <th>Width</th>
              <th>Height</th>
              <th>Length</th>
              <th></th>
            </thead>
            <tbody>
              <tr v-for="(item, i) in group.items" :key="item.id">
                <td></td>
                <td>
                  <input style="width: 100%">
                </td>
                <td>
                  <input type="number" v-model="item.dim1">
                </td>
                <td>
                  <input type="number" v-model="item.dim2">
                </td>
                <td>
                  <input type="number" v-model="item.dim3">
                </td>
                <td>
                  <CloseIcon class="button" @click.native="group.items.splice(i,1)"/>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="subtle" v-else>Add some items!</div>
        </card>
      </template>
      <div class="subtle" v-else>Add some groups!</div>
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

	private hexToRgb(hex: string) {
		const bigint = parseInt(hex, 16);
		const r = (bigint >> 16) & 255;
		const g = (bigint >> 8) & 255;
		const b = bigint & 255;
		return { r, g, b };
	}

	public addGroup() {
		const c = this.getNextColor();
		const rgb = this.hexToRgb(c.substr(1));
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

	public showColorPicker(e: Event) {
		(e.srcElement!.closest(".material-design-icon")!
			.nextElementSibling as HTMLElement)!.click();
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
.shadow {
	filter: drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.85));
}
.groups {
	> .group:first-child {
		margin-top: 0em;
	}
}
.group {
	background: rgba(255, 255, 255, 0.15);
    transition: background 0.2s;
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

