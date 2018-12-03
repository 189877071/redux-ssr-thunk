function flushInitializers(initializers: (() => Promise<any>)[]): Promise<any> {
    let promises: Promise<any>[] = []
    while (initializers.length) {
        let init = initializers.pop()
        promises.push(init())
    }
    return Promise.all(promises).then(function () {
        if (initializers.length) {
            return flushInitializers(initializers)
        }
    });
}

class ThunkMiddleware {

    constructor(private _isSSR: boolean = undefined) { }

    private _actions: (() => Promise<any>)[] = []

    private _getState: (() => any) | undefined = undefined

    thunk() {
        return (store: any) => (next: any) => (action: any) => {
            const { dispatch, getState } = store

            this._getState = getState

            if (typeof action === 'function') {
                if (this._isSSR) {
                    const newAction = async () => await action(dispatch, getState)

                    this._actions.push(newAction)
                    
                    return newAction
                }
                else {
                    return action(dispatch, getState)
                }
            }

            return next(action)
        };
    }

    execute() {
        return new Promise(resolve => flushInitializers(this._actions).then(() => resolve(this._getState && this._getState())))
    }
}

export = ThunkMiddleware