export interface Container {
	id: number;
	dim1: number;
	dim2: number;
	dim3: number;
}
export interface Item extends Container {
	color: string;
}
export interface ItemGroup {
	id: number;
	name: string;
	priority: number;
	color: string;
	items: Item[];
}
