import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { UmbContextConsumerMixin } from '../../../core/context';
import { UmbExtensionManifest, UmbExtensionRegistry } from '../../../core/extension';
//import { SubscriptionController } from '../../../core/test/subscription.controller';
import { UmbObserverMixin } from '../../../core/test/observer.mixin';

@customElement('umb-settings-section')
export class UmbSettingsSection extends UmbContextConsumerMixin(UmbObserverMixin(LitElement)) {
  static styles = [
    UUITextStyles,
    css`
      :host {
        display: block;
        padding: var(--uui-size-space-5);
      }
    `,
  ];

  @state()
  private _extensions?: UmbExtensionManifest[];

  constructor() {
    super();

    this.consumeContext('umbExtensionRegistry', (_instance: UmbExtensionRegistry) => {
      // new SubscriptionController(this, _instance.extensions, (value) => this._extensions = value);
      this.observe(_instance.extensions, (value: any) => this._extensions = value);
    });
  }

  render() {
    return html`
      <uui-box headline="Extensions">
        <uui-table>
          <uui-table-head>
            <uui-table-head-cell>Type</uui-table-head-cell>
            <uui-table-head-cell>Name</uui-table-head-cell>
            <uui-table-head-cell>Alias</uui-table-head-cell>
          </uui-table-head>

          ${this._extensions?.map(
            (extension) => html`
              <uui-table-row>
                <uui-table-cell>${extension.type}</uui-table-cell>
                <uui-table-cell>${extension.name}</uui-table-cell>
                <uui-table-cell>${extension.alias}</uui-table-cell>
              </uui-table-row>
            `
          )}
        </uui-table>
      </uui-box>
    `;
  }
}
