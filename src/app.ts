import './css/custom-properties.css';
import 'router-slot';

import { UUIIconRegistryEssential } from '@umbraco-ui/uui';
import { css, html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { firstValueFrom } from 'rxjs';
import { Guard, IRoute } from 'router-slot/model';

import { getServerStatus } from './core/api/fetcher';
import { UmbContextProviderMixin } from 'umbraco/context';
import { UmbExtensionManifest, UmbExtensionManifestCore, UmbExtensionRegistry, loadScript } from './core/extension';
import { ServerStatus } from './core/models';
import { internalManifests } from './temp-internal-manifests';

@customElement('umb-app')
export class UmbApp extends UmbContextProviderMixin(LitElement) {
	static styles = css`
		:host {
			overflow: hidden;
		}

		:host,
		#router-slot {
			display: block;
			width: 100%;
			height: 100vh;
		}
	`;

	@state()
	private _routes: IRoute[] = [
		{
			path: 'login',
			component: () => import('./auth/login/login.element'),
		},
		{
			path: 'install',
			component: () => import('./installer/installer.element'),
		},
		{
			path: 'upgrade',
			component: () => import('./upgrader/upgrader.element'),
			guards: [this._isAuthorizedGuard('/upgrade')],
		},
		{
			path: '**',
			component: () => import('./backoffice/backoffice.element'),
			guards: [this._isAuthorizedGuard()],
		},
	];

	private _extensionRegistry: UmbExtensionRegistry = new UmbExtensionRegistry();
	private _iconRegistry: UUIIconRegistryEssential = new UUIIconRegistryEssential();
	private _serverStatus: ServerStatus = 'running';

	constructor() {
		super();
		this._setup();
	}

	private async _setup() {
		this._iconRegistry.attach(this);
		this.provideContext('umbExtensionRegistry', this._extensionRegistry);

		await this._registerExtensionManifestsFromServer();
		await this._registerInternalManifests();
		await this._runStartupExtensions();
		await this._setInitStatus();
		this._redirect();
	}

	private async _setInitStatus() {
		try {
			const { data } = await getServerStatus({});
			this._serverStatus = data.serverStatus;
		} catch (error) {
			console.log(error);
		}
	}

	private _redirect() {
		switch (this._serverStatus) {
			case 'must-install':
				history.replaceState(null, '', '/install');
				break;

			case 'must-upgrade':
				history.replaceState(null, '', '/upgrade');
				break;

			case 'running': {
				const pathname =
					window.location.pathname === '/install' || window.location.pathname === '/upgrade'
						? '/'
						: window.location.pathname;
				history.replaceState(null, '', pathname);
				break;
			}
		}
	}

	private _isAuthorized(): boolean {
		return sessionStorage.getItem('is-authenticated') === 'true';
	}

	private _isAuthorizedGuard(redirectTo?: string): Guard {
		return () => {
			if (this._isAuthorized()) {
				return true;
			}

			let returnPath = '/login';

			if (redirectTo) {
				returnPath += `?redirectTo=${redirectTo}`;
			}

			history.replaceState(null, '', returnPath);
			return false;
		};
	}

	private async _registerExtensionManifestsFromServer() {
		// TODO: add schema and use fetcher
		const res = await fetch('/umbraco/backoffice/manifests');
		const { manifests } = await res.json();
		manifests.forEach((manifest: UmbExtensionManifest) => this._extensionRegistry.register(manifest));
	}

	private async _registerInternalManifests() {
		// TODO: where do we get these from?
		internalManifests.forEach((manifest: UmbExtensionManifestCore) =>
			this._extensionRegistry.register<UmbExtensionManifestCore>(manifest)
		);
	}

	private async _runStartupExtensions() {
		const extensions = await firstValueFrom(this._extensionRegistry.extensions);
		const startUpExtensions = extensions.filter((extension) => extension.type === 'startUp');
		const results: Array<Promise<any>> = [];

		for (const extension of startUpExtensions) {
			if (typeof extension.js === 'string') {
				results.push(loadScript(extension.js));
			}
		}

		await Promise.all(results);
	}

	render() {
		return html`<router-slot id="router-slot" .routes=${this._routes}></router-slot>`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'umb-app': UmbApp;
	}
}
