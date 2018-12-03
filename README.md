# redux-ssr-thunk

功能与 redux-thunk 一致。
针对服务器端渲染（SSR）进行了修改，在服务器端获取数据时提供了相应的异步处理 api 接口。
该插件需要与 **`react-async-bootstrapper`** 配合操作，在执行 `ReactDOMServer.renderToString(<App />)`之前，需要先执行一遍`<App />`组件，让组件有时间执行异步初始化操作。

# 安装
    yarn add react-async-bootstrapper
    yarn add redux-ssr-thunk

# 使用方式

    import ReduxSsrThunk from 'redux-ssr-thunk'
    
    import bootstrapper from 'react-async-bootstrapper'
    
    import { createStore, applyMiddleware } from 'redux'
    
    // SSR
    const Thunk = new ReduxSsrThunk(true)
    
    // SPA
    const Thunk = new ReduxSsrThunk()
    
    const store = createStore(reducers, applyMiddleware(Thunk.thunk))
    
    const Main = (store) => (
        <Provider store={store}>
            <App />
        </Provider>
    )
    
    // 仅 SSR端 调用
    await bootstrapper(Main)
    // 执行所有的异步函数 , 返回 states, states相当于执行getState()
    const states = await Thunk.execute()
    
    const html = ReactDOMServer.renderToString(Main)
	
# API
### thunk
redux中间件 `createStore(reducers, applyMiddleware(Thunk.thunk))`

### execute
把使用的异步函数放入 Promise.all() 并执行，返回 states
