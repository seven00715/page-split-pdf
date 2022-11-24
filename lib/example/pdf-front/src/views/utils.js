"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatFetchUrl = exports.downLoadPdfApi = exports.asyncFetch = exports.downloadPdf = void 0;
const axios_1 = __importDefault(require("axios"));
const qs_1 = __importDefault(require("qs"));
// 写在公用方法中
const downloadPdf = (blobData, downloadFileName) => {
    const link = document.createElement('a');
    const url = window.URL.createObjectURL(new Blob([blobData], { type: 'application/pdf,charset=utf-8' }));
    link.style.display = 'none';
    link.href = url;
    link.setAttribute('download', downloadFileName);
    document.body.appendChild(link);
    link.click();
};
exports.downloadPdf = downloadPdf;
// 异步单个下载
const asyncFetch = (params) => {
    return axios_1.default.get(`/asyncPrint?${qs_1.default.stringify(params)}`, {
        baseURL: '/pdf-server/api/pdf/v1',
        timeout: 300000,
    });
};
exports.asyncFetch = asyncFetch;
// 同步单个下载
const downLoadPdfApi = (params, onDownloadProgress) => {
    return axios_1.default.get(`/syncDownload?${qs_1.default.stringify(params)}`, {
        baseURL: '/pdf-server/api/pdf/v1',
        timeout: 300000,
        responseType: 'blob',
        onDownloadProgress,
    });
};
exports.downLoadPdfApi = downLoadPdfApi;
const formatFetchUrl = (originUrl, params) => {
    return `${originUrl}${params.pageRouter}`;
};
exports.formatFetchUrl = formatFetchUrl;
