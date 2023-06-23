import type { ClassConstructor } from '../extension-api/types.js';
import type { UmbControllerInterface } from './controller.interface.js';

/**
 * This mixin enables a class to host controllers.
 * This enables controllers to be added to the life cycle of this element.
 *
 * @param {Object} superClass - superclass to be extended.
 * @mixin
 */
export const UmbControllerHostBaseMixin = <T extends ClassConstructor<any>>(superClass: T) => {
	class UmbControllerHostBaseClass extends superClass {
		#controllers: UmbControllerInterface[] = [];

		#attached = false;

		/**
		 * Tests if a controller is assigned to this element.
		 * @param {UmbControllerInterface} ctrl
		 */
		hasController(ctrl: UmbControllerInterface): boolean {
			return this.#controllers.indexOf(ctrl) !== -1;
		}

		/**
		 * Retrieve controllers matching a filter of this element.
		 * @param {method} filterMethod
		 */
		getControllers(filterMethod: (ctrl: UmbControllerInterface) => boolean): UmbControllerInterface[] {
			return this.#controllers.filter(filterMethod);
		}

		/**
		 * Append a controller to this element.
		 * @param {UmbControllerInterface} ctrl
		 */
		addController(ctrl: UmbControllerInterface): void {
			// Check if there is one already with same unique
			this.removeControllerByUnique(ctrl.unique);

			this.#controllers.push(ctrl);
			if (this.#attached) {
				// If a controller is created on a already attached element, then it will be added directly. This might not be optimal. As the controller it self has not finished its constructor method jet. therefor i postpone the call:
				Promise.resolve().then(() => ctrl.hostConnected());
				//ctrl.hostConnected();
			}
		}

		/**
		 * Remove a controller from this element, by its unique/alias.
		 * @param {unknown} unique/alias
		 */
		removeControllerByUnique(unique: UmbControllerInterface['unique']): void {
			if (unique) {
				this.#controllers.forEach((x) => {
					if (x.unique === unique) {
						this.removeController(x);
					}
				});
			}
		}

		/**
		 * Remove a controller from this element.
		 * Notice this will also destroy the controller.
		 * @param {UmbControllerInterface} ctrl
		 */
		removeController(ctrl: UmbControllerInterface): void {
			const index = this.#controllers.indexOf(ctrl);
			if (index !== -1) {
				this.#controllers.splice(index, 1);
				if (this.#attached) {
					ctrl.hostDisconnected();
				}
				ctrl.destroy();
			}
		}

		/**
		 * Remove a controller from this element by its alias.
		 * Notice this will also destroy the controller.
		 * @param {string} unique
		 */
		removeControllerByAlias(unique: string): void {
			this.#controllers.forEach((x) => {
				if (x.unique === unique) {
					this.removeController(x);
				}
			});
		}

		hostConnected() {
			this.#attached = true;
			this.#controllers.forEach((ctrl: UmbControllerInterface) => ctrl.hostConnected());
		}

		hostDisconnected() {
			this.#attached = false;
			this.#controllers.forEach((ctrl: UmbControllerInterface) => ctrl.hostDisconnected());
		}

		destroy() {
			this.#controllers.forEach((ctrl: UmbControllerInterface) => ctrl.destroy());
		}
	}

	return UmbControllerHostBaseClass;
};
