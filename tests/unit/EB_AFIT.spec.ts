import { Item, EB_AFIT } from '@/packing/EB_AFIT';
import { expect } from 'chai';

const OR2DBinPackingReference = `1 2502505
1 112 104 88.47 89.52 1
587 233 220
3
1 108 0 76 0 30 1 40
2 110 0 43 1 25 1 33
3 92 1 81 1 55 1 39
2 2502605
2 138 131 87.21 88.21 1
587 233 220
3
1 49 0 25 1 21 1 41
2 60 1 51 1 41 1 53
3 103 1 76 1 64 1 44
3 2502705
3 127 117 89.27 89.64 0
587 233 220
3
1 97 0 81 0 27 1 41
2 102 0 78 0 39 1 42
3 113 0 46 1 36 1 44
4 2502805
4 197 186 91.13 91.29 2
587 233 220
3
1 113 0 92 0 33 1 67
2 52 1 37 1 28 1 60
3 57 1 33 1 29 1 70
5 2502905
5 136 127 90.87 91.34 1
587 233 220
3
1 88 0 54 1 39 1 51
2 94 0 54 1 36 1 38
3 87 0 77 1 43 1 47
6 2503005
6 147 116 87.01 87.16 1
587 233 220
3
1 86 1 84 1 45 1 56
2 81 0 45 1 34 1 56
3 70 1 54 1 37 1 35
7 2503105
7 126 84 86.46 86.63 1
587 233 220
3
1 118 0 79 1 51 1 37
2 86 0 32 1 31 1 44
3 64 1 58 1 52 1 45
8 2503205
8 180 170 92.95 93.18 1
587 233 220
3
1 75 1 58 1 57 1 58
2 57 1 37 1 30 1 66
3 79 0 74 0 35 1 56`;

describe('EB AFIT algorithm', () => {
	const split = OR2DBinPackingReference.split('\n');
	for (let i = 0; i < split.length; ) {
		console.log(i, split.length, split[i]);
		const id = split[i++];
		const expectedResults = split[i++].split(' ');
		const container = split[i++].split(' ');
		const itemCount = +split[i++];
		const items: Item[] = [];
		for (let x = 0; x < itemCount; x++) {
			const item = split[i++].split(' ');
			items.push({ ID: +item[0], Dim1: +item[1], Dim2: +item[3], Dim3: +item[5], Quantity: +item[7] } as any);
		}
		it('passes standard reference tests: ' + id, () => {
			const packer = new EB_AFIT();
			const result = packer.Run(
				{
					ID: 0,
					Length: +container[0],
					Width: +container[1],
					Height: +container[2],
				},
				items,
			);
			expect(result.packed.length + result.unpacked.length, 'incorrect total number of items').to.eq(
				+expectedResults[1],
			);
			expect(result.packed.length, 'incorrect number of packed items').to.eq(+expectedResults[2]);
		});
	}
});
