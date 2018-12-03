declare class ThunkMiddleware {
    private _isSSR;
    constructor(_isSSR?: boolean);
    private _actions;
    private _getState;
    thunk(): (store: any) => (next: any) => (action: any) => any;
    execute(): Promise<{}>;
}
export = ThunkMiddleware;
