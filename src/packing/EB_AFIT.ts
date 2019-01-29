/// <summary>
/// A 3D bin packing algorithm originally ported from https://github.com/keremdemirer/3dbinpackingjs,
/// which itself was a JavaScript port of https://github.com/wknechtel/3d-bin-pack/, which is a C reconstruction
/// of a novel algorithm developed in a U.S. Air Force master's thesis by Erhan Baltacioglu in 2001.
/// </summary>
// tslint:disable-next-line:class-name
export class EB_AFIT {
	private itemsToPack!: Item[];
	private itemsPackedInOrder!: Item[];
	private layers!: Layer[];

	private scrapfirst!: ScrapPad;
	private smallestZ!: ScrapPad;
	private trash!: ScrapPad;

	private evened!: boolean;
	private hundredPercentPacked = false;
	private layerDone!: boolean;
	private packing!: boolean;
	private packingBest = false;
	private quit = false;
	private bboxi: number = 0;
	private bestIteration: number = 0;
	private bestVariant: number = 0;
	private boxi: number = 0;
	private cboxi: number = 0;
	private layerListLen: number = 0;
	private packedItemCount: number = 0;
	private x: number = 0;

	private bbfx: number = 0;
	private bbfy: number = 0;
	private bbfz: number = 0;
	private bboxx: number = 0;
	private bboxy: number = 0;
	private bboxz: number = 0;
	private bfx: number = 0;
	private bfy: number = 0;
	private bfz: number = 0;
	private boxx: number = 0;
	private boxy: number = 0;
	private boxz: number = 0;
	private cboxx: number = 0;
	private cboxy: number = 0;
	private cboxz: number = 0;
	private layerinlayer: number = 0;
	private layerThickness: number = 0;
	private lilz: number = 0;
	private packedVolume: number = 0;
	private packedy: number = 0;
	private prelayer: number = 0;
	private prepackedy: number = 0;
	private preremainpy: number = 0;
	private px: number = 0;
	private py: number = 0;
	private pz: number = 0;
	private remainpy: number = 0;
	private remainpz: number = 0;
	private itemsToPackCount: number = 0;
	private totalItemVolume: number = 0;
	private totalContainerVolume: number = 0;
	/// <summary>
	/// Runs the packing algorithm.
	/// </summary>
	/// <param name="container">The container to pack items into.</param>
	/// <param name="items">The items to pack.</param>
	/// <returns>The bin packing result.</returns>
	public Run(container: Container, items: Item[]) {
		this.Initialize(container, items);
		this.ExecuteIterations(container);
		this.Report(container);

		return {
			packed: this.itemsPackedInOrder,
			unpacked: this.itemsToPack.slice(1, this.itemsToPack.length - 1).filter(p => !p.IsPacked),
		};
	}

	/// <summary>
	/// Analyzes each unpacked box to find the best fitting one to the empty space given.
	/// </summary>
	private AnalyzeBox(
		hmx: number,
		hy: number,
		hmy: number,
		hz: number,
		hmz: number,
		dim1: number,
		dim2: number,
		dim3: number,
	): void {
		if (dim1 <= hmx && dim2 <= hmy && dim3 <= hmz) {
			if (dim2 <= hy) {
				if (hy - dim2 < this.bfy) {
					this.boxx = dim1;
					this.boxy = dim2;
					this.boxz = dim3;
					this.bfx = hmx - dim1;
					this.bfy = hy - dim2;
					this.bfz = Math.abs(hz - dim3);
					this.boxi = this.x;
				} else if (hy - dim2 === this.bfy && hmx - dim1 < this.bfx) {
					this.boxx = dim1;
					this.boxy = dim2;
					this.boxz = dim3;
					this.bfx = hmx - dim1;
					this.bfy = hy - dim2;
					this.bfz = Math.abs(hz - dim3);
					this.boxi = this.x;
				} else if (hy - dim2 === this.bfy && hmx - dim1 === this.bfx && Math.abs(hz - dim3) < this.bfz) {
					this.boxx = dim1;
					this.boxy = dim2;
					this.boxz = dim3;
					this.bfx = hmx - dim1;
					this.bfy = hy - dim2;
					this.bfz = Math.abs(hz - dim3);
					this.boxi = this.x;
				}
			} else {
				if (dim2 - hy < this.bbfy) {
					this.bboxx = dim1;
					this.bboxy = dim2;
					this.bboxz = dim3;
					this.bbfx = hmx - dim1;
					this.bbfy = dim2 - hy;
					this.bbfz = Math.abs(hz - dim3);
					this.bboxi = this.x;
				} else if (dim2 - hy === this.bbfy && hmx - dim1 < this.bbfx) {
					this.bboxx = dim1;
					this.bboxy = dim2;
					this.bboxz = dim3;
					this.bbfx = hmx - dim1;
					this.bbfy = dim2 - hy;
					this.bbfz = Math.abs(hz - dim3);
					this.bboxi = this.x;
				} else if (dim2 - hy === this.bbfy && hmx - dim1 === this.bbfx && Math.abs(hz - dim3) < this.bbfz) {
					this.bboxx = dim1;
					this.bboxy = dim2;
					this.bboxz = dim3;
					this.bbfx = hmx - dim1;
					this.bbfy = dim2 - hy;
					this.bbfz = Math.abs(hz - dim3);
					this.bboxi = this.x;
				}
			}
		}
	}

	/// <summary>
	/// After finding each box, the candidate boxes and the condition of the layer are examined.
	/// </summary>
	private CheckFound(): void {
		this.evened = false;

		if (this.boxi !== 0) {
			this.cboxi = this.boxi;
			this.cboxx = this.boxx;
			this.cboxy = this.boxy;
			this.cboxz = this.boxz;
		} else {
			if (this.bboxi > 0 && (this.layerinlayer !== 0 || (this.smallestZ.Pre == null && this.smallestZ.Post == null))) {
				if (this.layerinlayer === 0) {
					this.prelayer = this.layerThickness;
					this.lilz = this.smallestZ.CumZ;
				}

				this.cboxi = this.bboxi;
				this.cboxx = this.bboxx;
				this.cboxy = this.bboxy;
				this.cboxz = this.bboxz;
				this.layerinlayer = this.layerinlayer + this.bboxy - this.layerThickness;
				this.layerThickness = this.bboxy;
			} else {
				if (this.smallestZ.Pre == null && this.smallestZ.Post == null) {
					this.layerDone = true;
				} else {
					this.evened = true;

					if (this.smallestZ.Pre == null) {
						this.trash = this.smallestZ.Post!;
						this.smallestZ.CumX = this.smallestZ.Post!.CumX;
						this.smallestZ.CumZ = this.smallestZ.Post!.CumZ;
						this.smallestZ.Post = this.smallestZ.Post!.Post;
						if (this.smallestZ.Post != null) {
							this.smallestZ.Post.Pre = this.smallestZ;
						}
					} else if (this.smallestZ.Post == null) {
						this.smallestZ.Pre.Post = null;
						this.smallestZ.Pre.CumX = this.smallestZ.CumX;
					} else {
						if (this.smallestZ.Pre.CumZ === this.smallestZ.Post.CumZ) {
							this.smallestZ.Pre.Post = this.smallestZ.Post.Post;

							if (this.smallestZ.Post.Post != null) {
								this.smallestZ.Post.Post.Pre = this.smallestZ.Pre;
							}

							this.smallestZ.Pre.CumX = this.smallestZ.Post.CumX;
						} else {
							this.smallestZ.Pre.Post = this.smallestZ.Post;
							this.smallestZ.Post.Pre = this.smallestZ.Pre;

							if (this.smallestZ.Pre.CumZ < this.smallestZ.Post.CumZ) {
								this.smallestZ.Pre.CumX = this.smallestZ.CumX;
							}
						}
					}
				}
			}
		}
	}

	/// <summary>
	/// Executes the packing algorithm variants.
	/// </summary>
	private ExecuteIterations(container: Container): void {
		let itelayer: number = 0;
		let layersIndex: number = 0;
		let bestVolume: number = 0;

		for (
			let containerOrientationVariant = 1;
			containerOrientationVariant <= 6 && !this.quit;
			containerOrientationVariant++
		) {
			switch (containerOrientationVariant) {
				case 1:
					this.px = container.Length;
					this.py = container.Height;
					this.pz = container.Width;
					break;

				case 2:
					this.px = container.Width;
					this.py = container.Height;
					this.pz = container.Length;
					break;

				case 3:
					this.px = container.Width;
					this.py = container.Length;
					this.pz = container.Height;
					break;

				case 4:
					this.px = container.Height;
					this.py = container.Length;
					this.pz = container.Width;
					break;

				case 5:
					this.px = container.Length;
					this.py = container.Width;
					this.pz = container.Height;
					break;

				case 6:
					this.px = container.Height;
					this.py = container.Width;
					this.pz = container.Length;
					break;
			}

			this.layers.push({ LayerEval: -1, LayerDim: 0 });
			this.ListCanditLayers();
			this.layers = this.layers.sort(l => l.LayerEval);

			for (layersIndex = 1; layersIndex <= this.layerListLen && !this.quit; layersIndex++) {
				this.packedVolume = 0.0;
				this.packedy = 0;
				this.packing = true;
				this.layerThickness = this.layers[layersIndex].LayerDim;
				itelayer = layersIndex;
				this.remainpy = this.py;
				this.remainpz = this.pz;
				this.packedItemCount = 0;

				for (this.x = 1; this.x <= this.itemsToPackCount; this.x++) {
					this.itemsToPack[this.x].IsPacked = false;
				}

				do {
					this.layerinlayer = 0;
					this.layerDone = false;

					this.PackLayer();

					this.packedy = this.packedy + this.layerThickness;
					this.remainpy = this.py - this.packedy;

					if (this.layerinlayer !== 0 && !this.quit) {
						this.prepackedy = this.packedy;
						this.preremainpy = this.remainpy;
						this.remainpy = this.layerThickness - this.prelayer;
						this.packedy = this.packedy - this.layerThickness + this.prelayer;
						this.remainpz = this.lilz;
						this.layerThickness = this.layerinlayer;
						this.layerDone = false;

						this.PackLayer();

						this.packedy = this.prepackedy;
						this.remainpy = this.preremainpy;
						this.remainpz = this.pz;
					}

					this.FindLayer(this.remainpy);
				} while (this.packing && !this.quit);

				if (this.packedVolume > bestVolume && !this.quit) {
					bestVolume = this.packedVolume;
					this.bestVariant = containerOrientationVariant;
					this.bestIteration = itelayer;
				}

				if (this.hundredPercentPacked) {
					break;
				}
			}

			if (this.hundredPercentPacked) {
				break;
			}

			if (container.Length === container.Height && container.Height === container.Width) {
				containerOrientationVariant = 6;
			}

			this.layers = [];
		}
	}

	/// <summary>
	/// Finds the most proper boxes by looking at all six possible orientations,
	/// empty space given, adjacent boxes, and pallet limits.
	/// </summary>
	private FindBox(hmx: number, hy: number, hmy: number, hz: number, hmz: number): void {
		let y: number;
		this.bfx = 32767;
		this.bfy = 32767;
		this.bfz = 32767;
		this.bbfx = 32767;
		this.bbfy = 32767;
		this.bbfz = 32767;
		this.boxi = 0;
		this.bboxi = 0;

		for (y = 1; y <= this.itemsToPackCount; y = y + this.itemsToPack[y].Quantity) {
			for (this.x = y; this.x < this.x + this.itemsToPack[y].Quantity - 1; this.x++) {
				if (!this.itemsToPack[this.x].IsPacked) {
					break;
				}
			}

			if (this.itemsToPack[this.x].IsPacked) {
				continue;
			}

			if (this.x > this.itemsToPackCount) {
				return;
			}

			this.AnalyzeBox(
				hmx,
				hy,
				hmy,
				hz,
				hmz,
				this.itemsToPack[this.x].Dim1,
				this.itemsToPack[this.x].Dim2,
				this.itemsToPack[this.x].Dim3,
			);

			if (
				this.itemsToPack[this.x].Dim1 === this.itemsToPack[this.x].Dim3 &&
				this.itemsToPack[this.x].Dim3 === this.itemsToPack[this.x].Dim2
			) {
				continue;
			}

			this.AnalyzeBox(
				hmx,
				hy,
				hmy,
				hz,
				hmz,
				this.itemsToPack[this.x].Dim1,
				this.itemsToPack[this.x].Dim3,
				this.itemsToPack[this.x].Dim2,
			);
			this.AnalyzeBox(
				hmx,
				hy,
				hmy,
				hz,
				hmz,
				this.itemsToPack[this.x].Dim2,
				this.itemsToPack[this.x].Dim1,
				this.itemsToPack[this.x].Dim3,
			);
			this.AnalyzeBox(
				hmx,
				hy,
				hmy,
				hz,
				hmz,
				this.itemsToPack[this.x].Dim2,
				this.itemsToPack[this.x].Dim3,
				this.itemsToPack[this.x].Dim1,
			);
			this.AnalyzeBox(
				hmx,
				hy,
				hmy,
				hz,
				hmz,
				this.itemsToPack[this.x].Dim3,
				this.itemsToPack[this.x].Dim1,
				this.itemsToPack[this.x].Dim2,
			);
			this.AnalyzeBox(
				hmx,
				hy,
				hmy,
				hz,
				hmz,
				this.itemsToPack[this.x].Dim3,
				this.itemsToPack[this.x].Dim2,
				this.itemsToPack[this.x].Dim1,
			);
		}
	}

	/// <summary>
	/// Finds the most proper layer height by looking at the unpacked boxes and the remaining empty space available.
	/// </summary>
	private FindLayer(thickness: number): void {
		let exdim = 0;
		let dimdif;
		let dimen2 = 0;
		let dimen3 = 0;
		let y: number;
		let z: number;
		let layereval: number;
		let evalx: number = 1000000;
		this.layerThickness = 0;

		for (this.x = 1; this.x <= this.itemsToPackCount; this.x++) {
			if (this.itemsToPack[this.x].IsPacked) {
				continue;
			}

			for (y = 1; y <= 3; y++) {
				switch (y) {
					case 1:
						exdim = this.itemsToPack[this.x].Dim1;
						dimen2 = this.itemsToPack[this.x].Dim2;
						dimen3 = this.itemsToPack[this.x].Dim3;
						break;

					case 2:
						exdim = this.itemsToPack[this.x].Dim2;
						dimen2 = this.itemsToPack[this.x].Dim1;
						dimen3 = this.itemsToPack[this.x].Dim3;
						break;

					case 3:
						exdim = this.itemsToPack[this.x].Dim3;
						dimen2 = this.itemsToPack[this.x].Dim1;
						dimen3 = this.itemsToPack[this.x].Dim2;
						break;
				}

				layereval = 0;

				if (
					exdim <= thickness &&
					((dimen2 <= this.px && dimen3 <= this.pz) || (dimen3 <= this.px && dimen2 <= this.pz))
				) {
					for (z = 1; z <= this.itemsToPackCount; z++) {
						if (!(this.x === z) && !this.itemsToPack[z].IsPacked) {
							dimdif = Math.abs(exdim - this.itemsToPack[z].Dim1);

							if (Math.abs(exdim - this.itemsToPack[z].Dim2) < dimdif) {
								dimdif = Math.abs(exdim - this.itemsToPack[z].Dim2);
							}

							if (Math.abs(exdim - this.itemsToPack[z].Dim3) < dimdif) {
								dimdif = Math.abs(exdim - this.itemsToPack[z].Dim3);
							}

							layereval = layereval + dimdif;
						}
					}

					if (layereval < evalx) {
						evalx = layereval;
						this.layerThickness = exdim;
					}
				}
			}
		}

		if (this.layerThickness === 0 || this.layerThickness > this.remainpy) {
			this.packing = false;
		}
	}

	/// <summary>
	/// Finds the first to be packed gap in the layer edge.
	/// </summary>
	private FindSmallestZ(): void {
		let scrapmemb = this.scrapfirst;
		this.smallestZ = scrapmemb;

		while (scrapmemb.Post != null) {
			if (scrapmemb.Post.CumZ < this.smallestZ.CumZ) {
				this.smallestZ = scrapmemb.Post;
			}

			scrapmemb = scrapmemb.Post;
		}
	}

	/// <summary>
	/// Initializes everything.
	/// </summary>
	private Initialize(container: Container, items: Item[]): void {
		this.itemsToPack = [];
		this.itemsPackedInOrder = [];

		// The original code uses 1-based indexing everywhere. This fake entry is added to the beginning
		// of the list to make that possible.
		this.itemsToPack.push({} as any);

		this.layers = [];
		this.itemsToPackCount = 0;

		for (const item of items) {
			for (let i = 1; i <= item.Quantity; i++) {
				this.itemsToPack.push({
					ID: item.ID,
					Dim1: item.Dim1,
					Dim2: item.Dim2,
					Dim3: item.Dim3,
					Quantity: item.Quantity,
					IsPacked: false,
					CoordX: 0,
					CoordY: 0,
					CoordZ: 0,
					PackDimX: 0,
					PackDimY: 0,
					PackDimZ: 0,
				});
			}

			this.itemsToPackCount += item.Quantity;
		}

		this.itemsToPack.push({} as any);

		this.totalContainerVolume = container.Length * container.Height * container.Width;
		this.totalItemVolume = 0.0;

		for (this.x = 1; this.x <= this.itemsToPackCount; this.x++) {
			const item = this.itemsToPack[this.x];
			const volume = item.Dim1 * item.Dim2 * item.Dim3;

			this.totalItemVolume = this.totalItemVolume + volume;
		}

		this.scrapfirst = {} as any;

		this.scrapfirst.Pre = null;
		this.scrapfirst.Post = null;
		this.packingBest = false;
		this.hundredPercentPacked = false;
		this.quit = false;
	}

	/// <summary>
	/// Lists all possible layer heights by giving a weight value to each of them.
	/// </summary>
	private ListCanditLayers(): void {
		let same: boolean;
		let exdim: number = 0;
		let dimdif: number = 0;
		let dimen2: number = 0;
		let dimen3: number = 0;
		let y: number = 0;
		let z: number = 0;
		let k: number = 0;
		let layereval: number = 0;

		this.layerListLen = 0;

		for (this.x = 1; this.x <= this.itemsToPackCount; this.x++) {
			for (y = 1; y <= 3; y++) {
				switch (y) {
					case 1:
						exdim = this.itemsToPack[this.x].Dim1;
						dimen2 = this.itemsToPack[this.x].Dim2;
						dimen3 = this.itemsToPack[this.x].Dim3;
						break;

					case 2:
						exdim = this.itemsToPack[this.x].Dim2;
						dimen2 = this.itemsToPack[this.x].Dim1;
						dimen3 = this.itemsToPack[this.x].Dim3;
						break;

					case 3:
						exdim = this.itemsToPack[this.x].Dim3;
						dimen2 = this.itemsToPack[this.x].Dim1;
						dimen3 = this.itemsToPack[this.x].Dim2;
						break;
				}

				if (exdim > this.py || ((dimen2 > this.px || dimen3 > this.pz) && (dimen3 > this.px || dimen2 > this.pz))) {
					continue;
				}

				same = false;

				for (k = 1; k <= this.layerListLen; k++) {
					if (exdim === this.layers[k].LayerDim) {
						same = true;
						continue;
					}
				}

				if (same) {
					continue;
				}

				layereval = 0;

				for (z = 1; z <= this.itemsToPackCount; z++) {
					if (!(this.x === z)) {
						dimdif = Math.abs(exdim - this.itemsToPack[z].Dim1);

						if (Math.abs(exdim - this.itemsToPack[z].Dim2) < dimdif) {
							dimdif = Math.abs(exdim - this.itemsToPack[z].Dim2);
						}
						if (Math.abs(exdim - this.itemsToPack[z].Dim3) < dimdif) {
							dimdif = Math.abs(exdim - this.itemsToPack[z].Dim3);
						}
						layereval = layereval + dimdif;
					}
				}

				this.layerListLen++;
				this.layers.push({
					LayerEval: layereval,
					LayerDim: exdim,
				});
			}
		}
	}

	/// <summary>
	/// Transforms the found coordinate system to the one entered by the user and writes them
	/// to the report file.
	/// </summary>
	private OutputBoxList(): void {
		let packCoordX: number = 0;
		let packCoordY: number = 0;
		let packCoordZ: number = 0;
		let packDimX: number = 0;
		let packDimY: number = 0;
		let packDimZ: number = 0;

		switch (this.bestVariant) {
			case 1:
				packCoordX = this.itemsToPack[this.cboxi].CoordX;
				packCoordY = this.itemsToPack[this.cboxi].CoordY;
				packCoordZ = this.itemsToPack[this.cboxi].CoordZ;
				packDimX = this.itemsToPack[this.cboxi].PackDimX;
				packDimY = this.itemsToPack[this.cboxi].PackDimY;
				packDimZ = this.itemsToPack[this.cboxi].PackDimZ;
				break;

			case 2:
				packCoordX = this.itemsToPack[this.cboxi].CoordZ;
				packCoordY = this.itemsToPack[this.cboxi].CoordY;
				packCoordZ = this.itemsToPack[this.cboxi].CoordX;
				packDimX = this.itemsToPack[this.cboxi].PackDimZ;
				packDimY = this.itemsToPack[this.cboxi].PackDimY;
				packDimZ = this.itemsToPack[this.cboxi].PackDimX;
				break;

			case 3:
				packCoordX = this.itemsToPack[this.cboxi].CoordY;
				packCoordY = this.itemsToPack[this.cboxi].CoordZ;
				packCoordZ = this.itemsToPack[this.cboxi].CoordX;
				packDimX = this.itemsToPack[this.cboxi].PackDimY;
				packDimY = this.itemsToPack[this.cboxi].PackDimZ;
				packDimZ = this.itemsToPack[this.cboxi].PackDimX;
				break;

			case 4:
				packCoordX = this.itemsToPack[this.cboxi].CoordY;
				packCoordY = this.itemsToPack[this.cboxi].CoordX;
				packCoordZ = this.itemsToPack[this.cboxi].CoordZ;
				packDimX = this.itemsToPack[this.cboxi].PackDimY;
				packDimY = this.itemsToPack[this.cboxi].PackDimX;
				packDimZ = this.itemsToPack[this.cboxi].PackDimZ;
				break;

			case 5:
				packCoordX = this.itemsToPack[this.cboxi].CoordX;
				packCoordY = this.itemsToPack[this.cboxi].CoordZ;
				packCoordZ = this.itemsToPack[this.cboxi].CoordY;
				packDimX = this.itemsToPack[this.cboxi].PackDimX;
				packDimY = this.itemsToPack[this.cboxi].PackDimZ;
				packDimZ = this.itemsToPack[this.cboxi].PackDimY;
				break;

			case 6:
				packCoordX = this.itemsToPack[this.cboxi].CoordZ;
				packCoordY = this.itemsToPack[this.cboxi].CoordX;
				packCoordZ = this.itemsToPack[this.cboxi].CoordY;
				packDimX = this.itemsToPack[this.cboxi].PackDimZ;
				packDimY = this.itemsToPack[this.cboxi].PackDimX;
				packDimZ = this.itemsToPack[this.cboxi].PackDimY;
				break;
		}

		this.itemsToPack[this.cboxi].CoordX = packCoordX;
		this.itemsToPack[this.cboxi].CoordY = packCoordY;
		this.itemsToPack[this.cboxi].CoordZ = packCoordZ;
		this.itemsToPack[this.cboxi].PackDimX = packDimX;
		this.itemsToPack[this.cboxi].PackDimY = packDimY;
		this.itemsToPack[this.cboxi].PackDimZ = packDimZ;

		this.itemsPackedInOrder.push(this.itemsToPack[this.cboxi]);
	}

	/// <summary>
	/// Packs the boxes found and arranges all variables and records properly.
	/// </summary>
	private PackLayer(): void {
		let lenx: number;
		let lenz: number;
		let lpz: number;

		if (this.layerThickness === 0) {
			this.packing = false;
			return;
		}

		this.scrapfirst.CumX = this.px;
		this.scrapfirst.CumZ = 0;

		for (; !this.quit; ) {
			this.FindSmallestZ();

			if (this.smallestZ.Pre == null && this.smallestZ.Post == null) {
				// *** SITUATION-1: NO BOXES ON THE RIGHT AND LEFT SIDES ***

				lenx = this.smallestZ.CumX;
				lpz = this.remainpz - this.smallestZ.CumZ;
				this.FindBox(lenx, this.layerThickness, this.remainpy, lpz, lpz);
				this.CheckFound();

				if (this.layerDone) {
					break;
				}
				if (this.evened) {
					continue;
				}

				this.itemsToPack[this.cboxi].CoordX = 0;
				this.itemsToPack[this.cboxi].CoordY = this.packedy;
				this.itemsToPack[this.cboxi].CoordZ = this.smallestZ.CumZ;
				if (this.cboxx === this.smallestZ.CumX) {
					this.smallestZ.CumZ = this.smallestZ.CumZ + this.cboxz;
				} else {
					this.smallestZ.Post = {} as any;

					this.smallestZ.Post!.Post = null;
					this.smallestZ.Post!.Pre = this.smallestZ;
					this.smallestZ.Post!.CumX = this.smallestZ.CumX;
					this.smallestZ.Post!.CumZ = this.smallestZ.CumZ;
					this.smallestZ.CumX = this.cboxx;
					this.smallestZ.CumZ = this.smallestZ.CumZ + this.cboxz;
				}
			} else if (this.smallestZ.Pre == null) {
				// *** SITUATION-2: NO BOXES ON THE LEFT SIDE ***

				lenx = this.smallestZ.CumX;
				lenz = this.smallestZ.Post!.CumZ - this.smallestZ.CumZ;
				lpz = this.remainpz - this.smallestZ.CumZ;
				this.FindBox(lenx, this.layerThickness, this.remainpy, lenz, lpz);
				this.CheckFound();

				if (this.layerDone) {
					break;
				}
				if (this.evened) {
					continue;
				}

				this.itemsToPack[this.cboxi].CoordY = this.packedy;
				this.itemsToPack[this.cboxi].CoordZ = this.smallestZ.CumZ;
				if (this.cboxx === this.smallestZ.CumX) {
					this.itemsToPack[this.cboxi].CoordX = 0;

					if (this.smallestZ.CumZ + this.cboxz === this.smallestZ.Post!.CumZ) {
						this.smallestZ.CumZ = this.smallestZ.Post!.CumZ;
						this.smallestZ.CumX = this.smallestZ.Post!.CumX;
						this.trash = this.smallestZ.Post!;
						this.smallestZ.Post = this.smallestZ.Post!.Post;

						if (this.smallestZ.Post != null) {
							this.smallestZ.Post.Pre = this.smallestZ;
						}
					} else {
						this.smallestZ.CumZ = this.smallestZ.CumZ + this.cboxz;
					}
				} else {
					this.itemsToPack[this.cboxi].CoordX = this.smallestZ.CumX - this.cboxx;

					if (this.smallestZ.CumZ + this.cboxz === this.smallestZ.Post!.CumZ) {
						this.smallestZ.CumX = this.smallestZ.CumX - this.cboxx;
					} else {
						this.smallestZ.Post!.Pre = {} as any;

						this.smallestZ.Post!.Pre!.Post = this.smallestZ.Post;
						this.smallestZ.Post!.Pre!.Pre = this.smallestZ;
						this.smallestZ.Post = this.smallestZ.Post!.Pre;
						this.smallestZ.Post!.CumX = this.smallestZ.CumX;
						this.smallestZ.CumX = this.smallestZ.CumX - this.cboxx;
						this.smallestZ.Post!.CumZ = this.smallestZ.CumZ + this.cboxz;
					}
				}
			} else if (this.smallestZ.Post == null) {
				// *** SITUATION-3: NO BOXES ON THE RIGHT SIDE ***

				lenx = this.smallestZ.CumX - this.smallestZ.Pre.CumX;
				lenz = this.smallestZ.Pre.CumZ - this.smallestZ.CumZ;
				lpz = this.remainpz - this.smallestZ.CumZ;
				this.FindBox(lenx, this.layerThickness, this.remainpy, lenz, lpz);
				this.CheckFound();

				if (this.layerDone) {
					break;
				}
				if (this.evened) {
					continue;
				}

				this.itemsToPack[this.cboxi].CoordY = this.packedy;
				this.itemsToPack[this.cboxi].CoordZ = this.smallestZ.CumZ;
				this.itemsToPack[this.cboxi].CoordX = this.smallestZ.Pre.CumX;

				if (this.cboxx === this.smallestZ.CumX - this.smallestZ.Pre.CumX) {
					if (this.smallestZ.CumZ + this.cboxz === this.smallestZ.Pre.CumZ) {
						this.smallestZ.Pre.CumX = this.smallestZ.CumX;
						this.smallestZ.Pre.Post = null;
					} else {
						this.smallestZ.CumZ = this.smallestZ.CumZ + this.cboxz;
					}
				} else {
					if (this.smallestZ.CumZ + this.cboxz === this.smallestZ.Pre.CumZ) {
						this.smallestZ.Pre.CumX = this.smallestZ.Pre.CumX + this.cboxx;
					} else {
						this.smallestZ.Pre.Post = {
							Pre: this.smallestZ.Pre,
							Post: this.smallestZ,
						} as any;

						this.smallestZ.Pre = this.smallestZ.Pre.Post!;
						this.smallestZ.Pre.CumX = this.smallestZ.Pre.Pre!.CumX + this.cboxx;
						this.smallestZ.Pre.CumZ = this.smallestZ.CumZ + this.cboxz;
					}
				}
			} else if (this.smallestZ.Pre.CumZ === this.smallestZ.Post.CumZ) {
				// *** SITUATION-4: THERE ARE BOXES ON BOTH OF THE SIDES ***

				// *** SUBSITUATION-4A: SIDES ARE EQUAL TO EACH OTHER ***

				lenx = this.smallestZ.CumX - this.smallestZ.Pre.CumX;
				lenz = this.smallestZ.Pre.CumZ - this.smallestZ.CumZ;
				lpz = this.remainpz - this.smallestZ.CumZ;

				this.FindBox(lenx, this.layerThickness, this.remainpy, lenz, lpz);
				this.CheckFound();

				if (this.layerDone) {
					break;
				}
				if (this.evened) {
					continue;
				}

				this.itemsToPack[this.cboxi].CoordY = this.packedy;
				this.itemsToPack[this.cboxi].CoordZ = this.smallestZ.CumZ;

				if (this.cboxx === this.smallestZ.CumX - this.smallestZ.Pre.CumX) {
					this.itemsToPack[this.cboxi].CoordX = this.smallestZ.Pre.CumX;

					if (this.smallestZ.CumZ + this.cboxz === this.smallestZ.Post.CumZ) {
						this.smallestZ.Pre.CumX = this.smallestZ.Post.CumX;

						if (this.smallestZ.Post.Post != null) {
							this.smallestZ.Pre.Post = this.smallestZ.Post.Post;
							this.smallestZ.Post.Post.Pre = this.smallestZ.Pre;
						} else {
							this.smallestZ.Pre.Post = null;
						}
					} else {
						this.smallestZ.CumZ = this.smallestZ.CumZ + this.cboxz;
					}
				} else if (this.smallestZ.Pre.CumX < this.px - this.smallestZ.CumX) {
					if (this.smallestZ.CumZ + this.cboxz === this.smallestZ.Pre.CumZ) {
						this.smallestZ.CumX = this.smallestZ.CumX - this.cboxx;
						this.itemsToPack[this.cboxi].CoordX = this.smallestZ.CumX - this.cboxx;
					} else {
						this.itemsToPack[this.cboxi].CoordX = this.smallestZ.Pre.CumX;
						this.smallestZ.Pre.Post = {} as any;
						this.smallestZ.Pre.Post!.Pre = this.smallestZ.Pre;
						this.smallestZ.Pre.Post!.Post = this.smallestZ;
						this.smallestZ.Pre = this.smallestZ.Pre.Post!;
						this.smallestZ.Pre.CumX = this.smallestZ.Pre.Pre!.CumX + this.cboxx;
						this.smallestZ.Pre.CumZ = this.smallestZ.CumZ + this.cboxz;
					}
				} else {
					if (this.smallestZ.CumZ + this.cboxz === this.smallestZ.Pre.CumZ) {
						this.smallestZ.Pre.CumX = this.smallestZ.Pre.CumX + this.cboxx;
						this.itemsToPack[this.cboxi].CoordX = this.smallestZ.Pre.CumX;
					} else {
						this.itemsToPack[this.cboxi].CoordX = this.smallestZ.CumX - this.cboxx;
						this.smallestZ.Post.Pre = {} as any;
						this.smallestZ.Post.Pre!.Post = this.smallestZ.Post;
						this.smallestZ.Post.Pre!.Pre = this.smallestZ;
						this.smallestZ.Post = this.smallestZ.Post.Pre;
						this.smallestZ.Post!.CumX = this.smallestZ.CumX;
						this.smallestZ.Post!.CumZ = this.smallestZ.CumZ + this.cboxz;
						this.smallestZ.CumX = this.smallestZ.CumX - this.cboxx;
					}
				}
			} else {
				// *** SUBSITUATION-4B: SIDES ARE NOT EQUAL TO EACH OTHER ***

				lenx = this.smallestZ.CumX - this.smallestZ.Pre.CumX;
				lenz = this.smallestZ.Pre.CumZ - this.smallestZ.CumZ;
				lpz = this.remainpz - this.smallestZ.CumZ;
				this.FindBox(lenx, this.layerThickness, this.remainpy, lenz, lpz);
				this.CheckFound();

				if (this.layerDone) {
					break;
				}
				if (this.evened) {
					continue;
				}

				this.itemsToPack[this.cboxi].CoordY = this.packedy;
				this.itemsToPack[this.cboxi].CoordZ = this.smallestZ.CumZ;
				this.itemsToPack[this.cboxi].CoordX = this.smallestZ.Pre.CumX;

				if (this.cboxx === this.smallestZ.CumX - this.smallestZ.Pre.CumX) {
					if (this.smallestZ.CumZ + this.cboxz === this.smallestZ.Pre.CumZ) {
						this.smallestZ.Pre.CumX = this.smallestZ.CumX;
						this.smallestZ.Pre.Post = this.smallestZ.Post;
						this.smallestZ.Post.Pre = this.smallestZ.Pre;
					} else {
						this.smallestZ.CumZ = this.smallestZ.CumZ + this.cboxz;
					}
				} else {
					if (this.smallestZ.CumZ + this.cboxz === this.smallestZ.Pre.CumZ) {
						this.smallestZ.Pre.CumX = this.smallestZ.Pre.CumX + this.cboxx;
					} else if (this.smallestZ.CumZ + this.cboxz === this.smallestZ.Post.CumZ) {
						this.itemsToPack[this.cboxi].CoordX = this.smallestZ.CumX - this.cboxx;
						this.smallestZ.CumX = this.smallestZ.CumX - this.cboxx;
					} else {
						this.smallestZ.Pre.Post = {
							Pre: this.smallestZ.Pre,
							Post: this.smallestZ,
						} as any;

						this.smallestZ.Pre = this.smallestZ.Pre.Post!;
						this.smallestZ.Pre.CumX = this.smallestZ.Pre.Pre!.CumX + this.cboxx;
						this.smallestZ.Pre.CumZ = this.smallestZ.CumZ + this.cboxz;
					}
				}
			}

			this.VolumeCheck();
		}
	}

	/// <summary>
	/// Using the parameters found, packs the best solution found and
	/// reports to the console.
	/// </summary>
	private Report(container: Container): void {
		this.quit = false;

		switch (this.bestVariant) {
			case 1:
				this.px = container.Length;
				this.py = container.Height;
				this.pz = container.Width;
				break;

			case 2:
				this.px = container.Width;
				this.py = container.Height;
				this.pz = container.Length;
				break;

			case 3:
				this.px = container.Width;
				this.py = container.Length;
				this.pz = container.Height;
				break;

			case 4:
				this.px = container.Height;
				this.py = container.Length;
				this.pz = container.Width;
				break;

			case 5:
				this.px = container.Length;
				this.py = container.Width;
				this.pz = container.Height;
				break;

			case 6:
				this.px = container.Height;
				this.py = container.Width;
				this.pz = container.Length;
				break;
		}

		this.packingBest = true;

		// Print("BEST SOLUTION FOUND AT ITERATION                      :", bestIteration, "OF VARIANT", bestVariant);
		// Print("TOTAL ITEMS TO PACK                                   :", itemsToPackCount);
		// Print("TOTAL VOLUME OF ALL ITEMS                             :", totalItemVolume);
		// Print("WHILE CONTAINER ORIENTATION X - Y - Z                 :", px, py, pz);

		this.layers.length = 0;
		this.layers.push({ LayerEval: -1, LayerDim: 0 });
		this.ListCanditLayers();
		this.layers = this.layers.sort(l => l.LayerEval);
		this.packedVolume = 0;
		this.packedy = 0;
		this.packing = true;
		this.layerThickness = this.layers[this.bestIteration].LayerDim;
		this.remainpy = this.py;
		this.remainpz = this.pz;

		for (let x = 1; x <= this.itemsToPackCount; x++) {
			this.itemsToPack[x].IsPacked = false;
		}

		do {
			this.layerinlayer = 0;
			this.layerDone = false;
			this.PackLayer();
			this.packedy = this.packedy + this.layerThickness;
			this.remainpy = this.py - this.packedy;

			if (this.layerinlayer > 0.0001) {
				this.prepackedy = this.packedy;
				this.preremainpy = this.remainpy;
				this.remainpy = this.layerThickness - this.prelayer;
				this.packedy = this.packedy - this.layerThickness + this.prelayer;
				this.remainpz = this.lilz;
				this.layerThickness = this.layerinlayer;
				this.layerDone = false;
				this.PackLayer();
				this.packedy = this.prepackedy;
				this.remainpy = this.preremainpy;
				this.remainpz = this.pz;
			}

			if (!this.quit) {
				this.FindLayer(this.remainpy);
			}
		} while (this.packing && !this.quit);
	}

	/// <summary>
	/// After packing of each item, the 100% packing condition is checked.
	/// </summary>
	private VolumeCheck(): void {
		this.itemsToPack[this.cboxi].IsPacked = true;
		this.itemsToPack[this.cboxi].PackDimX = this.cboxx;
		this.itemsToPack[this.cboxi].PackDimY = this.cboxy;
		this.itemsToPack[this.cboxi].PackDimZ = this.cboxz;
		const item = this.itemsToPack[this.cboxi];
		const volume = item.Dim1 * item.Dim2 * item.Dim3;
		this.packedVolume = this.packedVolume + volume;
		this.packedItemCount++;

		if (this.packingBest) {
			this.OutputBoxList();
		} else if (this.packedVolume === this.totalContainerVolume || this.packedVolume === this.totalItemVolume) {
			this.packing = false;
			this.hundredPercentPacked = true;
		}
	}
}

export interface Container {
	ID: number;
	Length: number;
	Width: number;
	Height: number;
}

export interface Item {
	ID: number;
	IsPacked: boolean;
	Dim1: number;
	Dim2: number;
	Dim3: number;
	CoordX: number;
	CoordY: number;
	CoordZ: number;
	Quantity: number;
	PackDimX: number;
	PackDimY: number;
	PackDimZ: number;
}

/// <summary>
/// A list that stores all the different lengths of all item dimensions.
/// From the master's thesis:
/// "Each Layerdim value in this array represents a different layer thickness
/// value with which each iteration can start packing. Before starting iterations,
/// all different lengths of all box dimensions along with evaluation values are
/// stored in this array" (p. 3-6).
/// </summary>
interface Layer {
	/// <summary>
	/// Gets or sets the layer dimension value, representing a layer thickness.
	/// </summary>
	/// <value>
	/// The layer dimension value.
	/// </value>
	LayerDim: number;

	/// <summary>
	/// Gets or sets the layer eval value, representing an evaluation weight
	/// value for the corresponding LayerDim value.
	/// </summary>
	/// <value>
	/// The layer eval value.
	/// </value>
	LayerEval: number;
}

/// <summary>
/// From the master's thesis:
/// "The double linked list we use keeps the topology of the edge of the
/// current layer under construction. We keep the x and z coordinates of
/// each gap's right corner. The program looks at those gaps and tries to
/// fill them with boxes one at a time while trying to keep the edge of the
/// layer even" (p. 3-7).
/// </summary>
interface ScrapPad {
	/// <summary>
	/// Gets or sets the x coordinate of the gap's right corner.
	/// </summary>
	/// <value>
	/// The x coordinate of the gap's right corner.
	/// </value>
	CumX: number;

	/// <summary>
	/// Gets or sets the z coordinate of the gap's right corner.
	/// </summary>
	/// <value>
	/// The z coordinate of the gap's right corner.
	/// </value>
	CumZ: number;

	/// <summary>
	/// Gets or sets the following entry.
	/// </summary>
	/// <value>
	/// The following entry.
	/// </value>
	Post: ScrapPad | null;

	/// <summary>
	/// Gets or sets the previous entry.
	/// </summary>
	/// <value>
	/// The previous entry.
	/// </value>
	Pre: ScrapPad | null;
}
