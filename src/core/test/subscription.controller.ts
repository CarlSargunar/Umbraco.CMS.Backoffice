import { ReactiveController, ReactiveControllerHost } from 'lit';
import { Observable, Subscription } from 'rxjs';

export class SubscriptionController<T> implements ReactiveController {
  private _subscription: Subscription | null = null;

  constructor(private _host: ReactiveControllerHost,
              private _source: Observable<T>,
              private _callback: (value: T) => void) {

    // TODO: how do we unsubscribe if the context is updated and a new subscription needs to be made?
    this._host.addController(this);
  }

  attach() {
    this.detach();
    this._subscription = this._source.subscribe(value => {
      this._callback(value);
    });
  }

  detach() {
    this._host.removeController(this);
    this._subscription?.unsubscribe();
  }

  hostConnected() {
    this.attach();
  }

  hostDisconnected() {
    this.detach();
  }
}