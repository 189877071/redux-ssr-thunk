interface objType {
    [str: string]: any
}

const obj: objType = {
    ACTION_PROMISES: [],
    stateExtends: undefined,
    thunk(isSsr?: boolean) {
        return (store: any) => (next: any) => (action: any) => {
            const { dispatch, getState } = store

            obj.stateExtends = getState

            if (typeof action === 'function') {
                if (isSsr) {
                    const newAction = async () => {
                        await action(dispatch, getState)
                    }
                    obj.ACTION_PROMISES.push(newAction)
                    return newAction
                }
                else {
                    return action(dispatch, getState)
                }
            }

            return next(action)
        };
    },
    execute() {
        return new Promise(resolve => flushInitializers(obj.ACTION_PROMISES).then(() => resolve(obj.stateExtends && obj.stateExtends())))
    }
}

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

export = obj