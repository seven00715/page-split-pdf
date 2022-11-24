"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vue_property_decorator_1 = require("vue-property-decorator");
const utils_1 = require("./utils");
let default_1 = class extends vue_property_decorator_1.Vue {
    onSyncDownload() {
        return __awaiter(this, void 0, void 0, function* () {
            this.isLoading = true;
            try {
                // 验证token是否有效
                const validToken = true; // 根据自己的项目验证token是否过期
                if (validToken) {
                    this.$notify.success({
                        title: '提交成功',
                        message: '报告提交成功，正在下载文件，请稍等...',
                        type: 'success',
                        duration: 5000,
                        iconClass: 'notify-icon-style',
                    });
                    this.onDownLoad();
                }
                else {
                    this.downloadStatus = 4;
                    this.hideDialog();
                }
            }
            catch (err) {
                this.downloadStatus = 4;
                this.hideDialog();
            }
        });
    }
    onDownLoad() {
        return __awaiter(this, void 0, void 0, function* () {
            this.showDialog();
            const originUrl = window.location.origin;
            const params = {
                pageRouter: '/syncPage?isServer=true',
                originUrl,
            };
            const downloadFileName = `同步下载报告~${new Date().toLocaleString()}.pdf`;
            console.log('formatFetchUrl ===>', (0, utils_1.formatFetchUrl)(originUrl, params));
            try {
                const res = yield (0, utils_1.downLoadPdfApi)(params, this.onDownloadProgress);
                console.log('res', res);
                if (res.data &&
                    Object.prototype.toString.call(res.data) === '[object Blob]') {
                    this.downloadStatus = 3;
                    this.$notify.success({
                        title: '下载成功',
                        message: downloadFileName + '下载成功',
                        duration: 6000,
                        iconClass: 'notify-icon-style',
                    });
                    this.downloadPdf(res.data, downloadFileName);
                    this.active = 3;
                    this.hideDialog(true);
                }
                else {
                    this.downloadStatus = 4;
                    this.$notify.error({
                        title: '下载失败',
                        message: downloadFileName + '下载失败',
                        duration: 6000,
                        iconClass: 'notify-icon-style',
                    });
                    this.hideDialog();
                }
            }
            catch (e) {
                this.downloadStatus = 4;
                console.log('download res', e);
                this.$notify.error({
                    title: '下载失败',
                    message: '下载失败' + e,
                    duration: 6000,
                    iconClass: 'notify-icon-style',
                });
                this.hideDialog();
            }
        });
    }
    onDownloadProgress(progressEvent) {
        if (progressEvent) {
            const { total, loaded } = progressEvent;
            if (total <= 0)
                return;
            if (this.active !== 2) {
                this.active = 2;
            }
            const t = Number(String(Math.floor((loaded / total) * 100)).split('.')[0]);
            this.percentage = t;
        }
    }
    downloadPdf(blobData, downloadFileName) {
        const link = document.createElement('a');
        const url = window.URL.createObjectURL(new Blob([blobData], { type: 'application/pdf,charset=utf-8' }));
        link.style.display = 'none';
        link.href = url;
        link.setAttribute('download', downloadFileName);
        document.body.appendChild(link);
        link.click();
    }
    showDialog() {
        this.isLoading = true;
        this.percentage = 0;
        this.active = 1;
        this.show = 1;
    }
    hideDialog(bool) {
        this.isLoading = false;
        if (bool) {
            setTimeout(() => {
                this.show = 2;
            }, 2500);
        }
        else {
            this.show = 0;
        }
        setTimeout(() => {
            this.percentage = 0;
        }, 4000);
    }
};
default_1 = __decorate([
    (0, vue_property_decorator_1.Component)({
        name: 'DownloadMixins',
    })
], default_1);
exports.default = default_1;
