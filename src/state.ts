import { Component, Vue } from "vue-property-decorator";
import { Container, ItemGroup } from "./models";

@Component({})
class State extends Vue {
	public containers: Container[] = [];
	public groups: ItemGroup[] = [];
}

export default new State();
