/**
 * 开发环境跨域代理配制，配合biz.conf.js文件中 ENV:'TEST' 时有有效
 */
const { createProxyMiddleware } = require('http-proxy-middleware');

const porxyMiddleware = createProxyMiddleware('/app_proxy', {

	target: 'http://180.100.208.181:8989/', // 换成自己的api接口baseUrl
	changeOrigin: true,
	pathRewrite: {
		'^/app_proxy': ''
	},
	logLevel: 'debug'
});

module.exports = porxyMiddleware;
