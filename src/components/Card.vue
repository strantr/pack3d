<template>
	<div class="card">
		<div class="card__header">
			<slot name="header">
				<slot name="title--before"></slot>
				<slot name="title">
					<component :is="headerTag"
					           class="card__title"><template v-if="title">{{title}}</template></component>
				</slot>
				<slot name="title--after"></slot>
			</slot>
		</div>
		<div class="card__body">
			<slot />
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
export default class Card extends Vue {
	@Prop() public title!: string;
	@Prop({ default: "h3" }) public headerTag!: string;
}
</script>

<style lang="scss">
.card {
	background: rgba(0, 0, 0, 0.25);
	margin-top: 0.75em;
	display: flex;
	flex-direction: column;
    overflow: hidden;
	&__header {
		border-bottom: 1px solid rgba(255, 255, 255, 0.2);
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.75em;
		flex-shrink: 0;
		&__buttons {
			display: flex;
			> * {
				margin-left: 0.5em;
			}
		}
	}
	&__title {
		margin: 0;
		font-weight: normal;
		font-size: 1.1em;
	}
	&__body {
		padding: 1em;
        overflow: auto;
        flex: 1 1 auto;
	}
}
</style>
