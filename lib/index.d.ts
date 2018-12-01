declare function createThunkMiddleware(isSsr?: boolean): (obj: any) => (next: any) => (action: any) => any;
declare const _default: {
    thunk: typeof createThunkMiddleware;
    execute: () => Promise<{}>;
};
export = _default;
