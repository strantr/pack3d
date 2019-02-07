<template>
	<div class="sidebar"
	     :class="{collapsed}">
		<div class="sidebar__header">
			<h1 class="sidebar__title">
				<img alt=""
				     class="sidebar__logo"
				     src="@/assets/logo.svg"
				     width="48"
				     height="48" /> pack<span class="sidebar__title--highlight">3d</span>
			</h1>
			<div class="sidebar__buttons">
				<SettingsOutlineIcon class="button"
				                     title="Application Settings" />
				<ChevronLeftIcon class="button x2"
				                 title="Hide Menu"
				                 @click.native="collapsed=true" />
			</div>
		</div>
		<div class="sidebar__expand">
			<ChevronRightIcon class="button x2"
			                  title="Show Menu"
			                  @click.native="collapsed=false" />
		</div>
		<slot v-if="!collapsed" />
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import SettingsOutlineIcon from "icons/SettingsOutline.vue";
import ChevronLeftIcon from "icons/ChevronLeft.vue";
import ChevronRightIcon from "icons/ChevronRight.vue";

@Component({
	components: {
		SettingsOutlineIcon,
		ChevronLeftIcon,
		ChevronRightIcon
	}
})
export default class Sidebar extends Vue {
	public collapsed: boolean = false;
}
</script>

<style lang="scss">
$bg: rgb(133, 108, 234);
.sidebar {
	padding: 0.75em;
	background: linear-gradient($bg, lighten(saturate($bg, 5%), 5%) 10%);
	transition: all 0.2s;
	min-width: 25em;
	display: flex;
	flex-direction: column;
	max-height: 100vh;
	flex: auto;
	&.collapsed {
		min-width: 0;
		width: calc(48px + 1em);
		overflow: hidden;
		min-width: unset;
		flex: 1;
		.sidebar__header {
			border-bottom: none;
		}
		.sidebar__expand {
			display: block;
		}
	}
	&__expand {
		text-align: center;
		display: none;
	}
	&__header {
		display: flex;
		align-content: center;
		justify-content: space-between;
		flex-shrink: 0;
		padding: 0 0 0.75em 0;
		margin: 0;
		border-bottom: 1px solid rgba(255, 255, 255, 0.25);
	}
	&__logo {
		margin-right: 0.5em;
	}
	&__title {
		font-weight: normal;
		font-size: 1.5em;
		display: flex;
		align-items: center;
		margin: 0;
		&--highlight {
			color: complement($color: $bg);
		}
	}
	&__buttons {
		display: flex;
		align-content: center;
		margin-left: 2em;
		.x2 {
			margin-left: 0.5em;
			border-left: 1px solid rgba(255, 255, 255, 0.25);
		}
	}
}
</style>
