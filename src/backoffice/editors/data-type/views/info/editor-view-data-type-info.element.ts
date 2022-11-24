import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { distinctUntilChanged } from 'rxjs';
import { UmbDataTypeContext } from '../../data-type.context';
import type { DataTypeDetails } from '../../../../../core/mocks/data/data-type.data';
import { UmbObserverMixin } from '@umbraco-cms/observable-api';
import { UmbContextConsumerMixin } from '@umbraco-cms/context-api';

@customElement('umb-editor-view-data-type-info')
export class UmbEditorViewDataTypeInfoElement extends UmbContextConsumerMixin(UmbObserverMixin(LitElement)) {
	static styles = [UUITextStyles, css``];

	@state()
	_dataType?: DataTypeDetails;

	private _dataTypeContext?: UmbDataTypeContext;

	constructor() {
		super();

		this.consumeContext('umbDataTypeContext', (dataTypeContext) => {
			this._dataTypeContext = dataTypeContext;
			this._observeDataType();
		});
	}

	private _observeDataType() {
		if (!this._dataTypeContext) return;

		this.observe<DataTypeDetails>(this._dataTypeContext.data.pipe(distinctUntilChanged()), (dataType) => {
			this._dataType = dataType;
		});
	}

	render() {
		return html` ${this._renderGeneralInfo()}${this._renderReferences()} `;
	}

	private _renderGeneralInfo() {
		return html`
			<uui-box headline="General" style="margin-bottom: 20px;">
				<umb-editor-property-layout label="Key">
					<div slot="editor">${this._dataType?.key}</div>
				</umb-editor-property-layout>
				<umb-editor-property-layout
					label="Property Editor Alias
">
					<div slot="editor">${this._dataType?.propertyEditorModelAlias}</div>
				</umb-editor-property-layout>

				<umb-editor-property-layout
					label="Property Editor UI Alias
">
					<div slot="editor">${this._dataType?.propertyEditorUIAlias}</div>
				</umb-editor-property-layout>
			</uui-box>
		`;
	}

	private _renderReferences() {
		return html` <uui-box headline="References"> </uui-box> `;
	}
}

export default UmbEditorViewDataTypeInfoElement;

declare global {
	interface HTMLElementTagNameMap {
		'umb-editor-view-data-type-info': UmbEditorViewDataTypeInfoElement;
	}
}