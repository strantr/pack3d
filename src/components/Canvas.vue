<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import * as THREE from "three";

@Component({})
export default class Canvas extends Vue {
	private mounted() {
		const camera = new THREE.PerspectiveCamera(
			75,
			this.$el.clientWidth / this.$el.clientHeight,
			0.1,
			1000
		);

		const scene = new THREE.Scene();
		scene.background = new THREE.Color("white");

		const renderer = new THREE.WebGLRenderer({ alpha: true });
		renderer.setSize(this.$el.clientWidth - 20, this.$el.clientHeight - 5);
		renderer.setClearColor(0xffffff, 0);
		this.$el.appendChild(renderer.domElement);

		const geometry = new THREE.BoxGeometry(1, 1, 1);
		const material = new THREE.MeshBasicMaterial({
			color: 0x00ff00,
			wireframe: true
		});
		const cube = new THREE.Mesh(geometry, material);
		scene.add(cube);

		camera.position.z = 5;
		function animate() {
			requestAnimationFrame(animate);
			cube.rotation.x += 0.01;
			cube.rotation.y += 0.01;
			renderer.render(scene, camera);
		}
		animate();

		window.addEventListener("resize", e => {
			renderer.setSize(this.$el.clientWidth - 20, this.$el.clientHeight - 5);
			camera.aspect = this.$el.clientWidth / this.$el.clientHeight;
			camera.updateProjectionMatrix();
		});
	}
}
</script>

<style lang="scss">
</style>
