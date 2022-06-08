import { UUITextStyles } from '@umbraco-ui/uui-css/lib';
import { css, CSSResultGroup, html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { isPathActive, path } from 'router-slot';
import { map } from 'rxjs';

import { getUserSections } from '../../core/api/fetcher';
import { UmbContextConsumerMixin } from '../../core/context';
import { UmbExtensionManifestSection, UmbExtensionRegistry } from '../../core/extension';
import { UmbObserverMixin } from '../../core/test/observer.mixin';

@customElement('umb-backoffice-header-sections')
export class UmbBackofficeHeaderSections extends UmbContextConsumerMixin(UmbObserverMixin(LitElement)) {
  static styles: CSSResultGroup = [
    UUITextStyles,
    css`
      #tabs {
        color: var(--uui-color-header-contrast);
        height: 60px;
        font-size: 16px;
        --uui-tab-text: var(--uui-color-header-contrast);
        --uui-tab-text-hover: var(--uui-color-header-contrast-emphasis);
        --uui-tab-text-active: var(--uui-color-header-contrast-emphasis);
        --uui-tab-background: var(--uui-color-header-background);
      }

      #dropdown {
        background-color: white;
        border-radius: var(--uui-border-radius);
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        box-shadow: var(--uui-shadow-depth-3);
        min-width: 200px;
        color: black; /* Change to variable */
      }
    `,
  ];

  @state()
  private _open = false;

  @state()
  private _allowedSection: Array<string> = [];

  @state()
  private _sections: Array<UmbExtensionManifestSection> = [];

  @state()
  private _visibleSections: Array<UmbExtensionManifestSection> = [];

  @state()
  private _extraSections: Array<UmbExtensionManifestSection> = [];

  @state()
  private _currentSectionAlias = '';

  private _extensionRegistry?: UmbExtensionRegistry;

  constructor() {
    super();

    this.consumeContext('umbExtensionRegistry', (extensionRegistry: UmbExtensionRegistry) => {
      this._extensionRegistry = extensionRegistry;
      this._useSections();
    });
  }

  private _handleMore(e: MouseEvent) {
    e.stopPropagation();
    this._open = !this._open;
  }

  private _handleTabClick(e: PointerEvent) {
    const tab = e.currentTarget as HTMLElement;

    // TODO: we need to be able to prevent the tab from setting the active state
    if (tab.id === 'moreTab') {
      return;
    }
  }

  private _handleLabelClick() {
    const moreTab = this.shadowRoot?.getElementById('moreTab');
    moreTab?.setAttribute('active', 'true');

    this._open = false;
  }

  private async _useSections() {
    const { data } = await getUserSections({});
    this._allowedSection = data.sections;

    if (!this._extensionRegistry) return;

    const sections$ = this._extensionRegistry.extensionsOfType('section')
    .pipe(
      map((sections) => sections
      .filter(section => this._allowedSection.includes(section.alias))
      .sort((a, b) => b.meta.weight - a.meta.weight))
    )
    
    this.observe(sections$, (sections: any) => {
      this._sections = sections;
      this._visibleSections = this._sections;
    });
  }

  render() {
    return html`
      <uui-tab-group id="tabs">
        ${this._visibleSections.map(
          (section: UmbExtensionManifestSection) => html`
            <uui-tab
              ?active="${isPathActive(`/section/${section.meta.pathname}`, path())}"
              href="${`/section/${section.meta.pathname}`}"
              label="${section.name}"></uui-tab>
          `
        )}
        ${this._renderExtraSections()}
      </uui-tab-group>
    `;
  }

  private _renderExtraSections() {
    return when(
      this._extraSections.length > 0,
      () => html`
        <uui-tab id="moreTab" @click="${this._handleTabClick}">
          <uui-popover .open=${this._open} placement="bottom-start" @close="${() => (this._open = false)}">
            <uui-button slot="trigger" look="primary" label="More" @click="${this._handleMore}" compact>
              <uui-symbol-more></uui-symbol-more>
            </uui-button>

            <div slot="popover" id="dropdown">
              ${this._extraSections.map(
                (section) => html`
                  <uui-menu-item
                    ?active="${this._currentSectionAlias === section.alias}"
                    label="${section.name}"
                    @click-label="${this._handleLabelClick}"></uui-menu-item>
                `
              )}
            </div>
          </uui-popover>
        </uui-tab>
      `
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'umb-backoffice-header-sections': UmbBackofficeHeaderSections;
  }
}
