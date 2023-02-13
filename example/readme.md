# html to pdf demo
- 如果需要跑完整demo，需要分别启动pdf-front和pdf-server,安装依赖，执行启动命令;
## pdf-front

- 用 vue-cli 初始化的 pdf demo
- 启动方式

```text

npm install
npm run dev
```

## pdf-server

```text

npm install
npm run dev:local // 本地跑demo，用这个，本地开发调试，启动一个进程
npm run dev  // 生产前台启动，启动多进程、进程守护
npm run start // 生产后台启动，启动多进程、进程守护

启动成功了，node 会启动一个8090的端口，前端发送请求到8090
```

## api
- 健康检查接口：
  - http://localhost:8090/pdf-server/api/pdf/v1
  - 如果这个接口返回 {"status":200,"msg":"pdf server ready"} 说明node服务启动正常

- 接口定义地址 // pdf-server/src/router/index.js
- 如果是前端下载 windown.print() or htmlToCanvas()

### node端同步下载
- get  /syncDownload
  - 前提：node 端同步下载，需要准备的前提
    - Puppeteer 是否下载成功，node 服务和 Puppeteer 都是否成功启动,如果启动成功 会有两条日志：
      - chrome headless broswer ready,xxxxx
      - pdf server run at 8090 xxxxx
    - 同步下载不用redis


### node端异步下载准备
- http://localhost:8090/pdf-server/api/pdf/v1/ui/ 是异步 UI 可视化界面进度的地址，可以在异步情况方便调试问题；
  <image src="./pdf-server/static/images/process-ui.png" />
- 前提：node 端异步下载，需要准备的前提

  - 先需要本地启动 redis 服务
    - 如果是 mac， brew install redis, 然后 redis-server 启动,如果是其他平台参考 https://www.runoob.com/redis/redis-install.html
  - Puppeteer 是否下载成功，node 服务和 Puppeteer 都是否成功启动
    - 如果启动成功 会有两条日志：
      - chrome headless broswer ready,xxxxx
      - pdf server run at 8090 xxxxx
### node端异步下载接口
- node端单个异步下载  get  /asyncPrint
- node端批量异步下载  post  /asyncManyPrint
  - node 异步批量下载，和node异步单个下载类似，只是请求方式变为post，将批量下载的链接和参数传递过去即可

  - 异步下载成功后生成的文件在./static/pdf/目录下，也可以返回前端，可以在await page.pdf()方法中设置；
  <image src="./pdf-server/static/images/async-download-dir.png" />

- pdf-server 异步架构是：
  - 两个服务: npm run serve -> server 和 npm run dev -> app
    - 其中 server 服务负责 push 任务，
    - 另外一个 app 服务负责处理队列中的任务，这个服务是个多进程服务
      - 如果部署方式是 docker,多进程开启方式用 cluster/pm2
      - 如果部署方式是 k8s,这里的代码需要用单进程的方式，用 k8s 的 replicas 设置多个副本，开启多进程

