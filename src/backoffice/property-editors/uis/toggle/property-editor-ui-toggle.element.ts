import { html, LitElement } from 'lit';
import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { customElement, property } from 'lit/decorators.js';

/**
 * @element umb-property-editor-ui-toggle
 */
@customElement('umb-property-editor-ui-toggle')
export class UmbPropertyEditorUIToggleElement extends LitElement {
	static styles = [UUITextStyles];

	@property()
	value = '';

	@property({ type: Array, attribute: false })
	public config = [];

	render() {
		return html`<div>umb-property-editor-ui-toggle</div>`;
	}
}

export default UmbPropertyEditorUIToggleElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-property-editor-ui-toggle': UmbPropertyEditorUIToggleElement;
	}
}