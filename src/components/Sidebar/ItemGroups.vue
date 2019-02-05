<template>
  <card title="Item Groups">
    <div slot="title--after" class="card__header__buttons">
      <PlusIcon title="Add new group" class="button" @click.native="addGroup"/>
    </div>
    <div>
      <template v-if="groups.length">
        <card class="group" v-for="group in groups" :key="group.id">
          <div slot="header">
            <input class="group__name" v-model="group.name">
            <PencilIcon/>
          </div>
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

@Component({
	components: {
		Card,
		PlusIcon,
		CloseIcon,
		PencilIcon
	}
})
export default class ItemGroups extends Vue {
	@Prop({ required: true }) public groups!: ItemGroup[];
	private groupId: number = 1;
	private colors: string[] = [];

	public addGroup() {
		this.groups.push({
			id: this.groupId++,
			name: "Group " + this.groupId,
			color: this.getNextColor(),
			priority: 1
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
.group {
	&__name {
		background: transparent;
        border: none;
        color: #fff;
        font-size: 1em;
	}
}
</style>

