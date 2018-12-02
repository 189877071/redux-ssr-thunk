let ACTION_PROMISES: (() =>  Promise<any>)[] = []

let stateExtends: () => any

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

function createThunkMiddleware(isSsr?: boolean) {
    return (obj: any) => (next: any) => (action: any) => {
        const { dispatch, getState } = obj
        
        stateExtends = getState

        if (typeof action === 'function') {
            if(isSsr) {
                const newAction = async () =>  {
                    await action(dispatch, getState)
                }
                ACTION_PROMISES.push(newAction)
                return newAction
            }
            else {
                return action(dispatch, getState)
            }
        }

        return next(action)
    };
}

const thunk  = createThunkMiddleware

const execute = () => new Promise(resolve => flushInitializers(ACTION_PROMISES).then(() => {
    resolve(stateExtends && stateExtends())
}))

export = {
    thunk,
    execute
}