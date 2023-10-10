import { createExtensionApi } from '@umbraco-cms/backoffice/extension-api';
import { umbExtensionsRegistry } from '@umbraco-cms/backoffice/extension-registry';
import { UmbBaseController, UmbControllerHostElement } from '@umbraco-cms/backoffice/controller-api';

/**
 * @deprecated
 * Initializes multiple extensions APIs for a host element.
 * Extension API will be given one argument, the host element.
 *
 * @param host The host element to initialize extension classes for.
 * @param extensionTypes The extension types(strings) to initialize.
 *
 */
// TODO: Get rid of this, use Extension API Controller instead.
export class UmbMultiExtensionsApiInitializer extends UmbBaseController {
	#extensionMap = new Map();

	constructor(host: UmbControllerHostElement, extensionTypes: Array<string>) {
		super(host);

		this.observe(umbExtensionsRegistry.extensionsOfTypes(extensionTypes), (extensions) => {
			if (!extensions) return;

			// Clean up removed extensions:
			this.#extensionMap.forEach((value, key) => {
				if (!extensions.find((incoming) => incoming.alias === key)) {
					this.#extensionMap.delete(key);
					value.destroy();
				}
			});

			extensions.forEach((extension) => {
				if (this.#extensionMap.has(extension.alias)) return;

				// Notice, currently no way to re-initialize an extension class if it changes. But that does not seem necessary currently. (Otherwise look at implementing the UmbExtensionClassInitializer)

				// Instantiate and provide extension JS class. For Context API the classes provide them selfs when the class instantiates.
				this.#extensionMap.set(extension.alias, createExtensionApi(extension, [this._host]));
			});
		});
	}

	public destroy(): void {
		this.#extensionMap.forEach((extension) => {
			extension.destroy();
		});
		this.#extensionMap.clear();
	}
}