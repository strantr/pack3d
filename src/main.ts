import Vue from 'vue';
import App from './App.vue';
import { EB_AFIT } from './packing/EB_AFIT';

Vue.config.productionTip = false;

new Vue({
	render: h => h(App),
}).$mount('#app');

const pack = new EB_AFIT();
pack.Run(
	{
		Height: 1,
		Length: 10,
		Width: 10,
		ID: 1,
	},
	[
		{
			ID: 1,
			Dim1: 5,
			Dim2: 5,
			Dim3: 1,
			Quantity: 2,
		} as any,
	],
);
