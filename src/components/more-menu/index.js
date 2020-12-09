import { createElement, Component } from 'preact';
import { withIntl } from '../../enhancers';
import { withText } from 'preact-i18n';

@withIntl()
@withText({
	title: 'zimbra-zimlet-signature-template.title'
})
export default class MoreMenu extends Component {
	constructor(props) {
		super(props);
		this.zimletContext = props.children.context;

		//Get all zimlets
		const zimlets = this.zimletContext.getAccount().zimlets;

		this.globalConfig = new Map();

		//Get the current zimlet
		const zimlet = zimlets.zimlet.find(
			zimlet => zimlet.zimlet[0].name === 'zimbra-zimlet-signature-template'
		);

		//Add zimlet configuration properties to an ES6 Map
		if (zimlet) {
			const globalConfig = zimlet.zimletConfig[0].global[0].property || [];
			for (let i = 0; i < globalConfig.length; i++) {
				this.globalConfig.set(globalConfig[i].name, window.atob(globalConfig[i].content));
			}
		}
		//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
		//now you can get a property value by doing: this.globalConfig.get('name-of-property')
	}

	//Use this.props.getComposer().setContent to replace the contents of the composer textarea
	handleClick = e => {
		this.props.getComposer().setContent(this.globalConfig.get('htmlTemplate'));
	};

	render() {
		//Only show the Zimlet in the UI where we want it.

		if (this.props.editorType === 'signature') {
			return (
				<div style="float:right">
					<button
						onClick={this.handleClick}
						type="button"
						class="blocks_button_button blocks_button_regular zimbra-client_settings_subsectionBodyButton"
					>
						{this.props.title}
					</button>
				</div>
			);
		}
	}
}
