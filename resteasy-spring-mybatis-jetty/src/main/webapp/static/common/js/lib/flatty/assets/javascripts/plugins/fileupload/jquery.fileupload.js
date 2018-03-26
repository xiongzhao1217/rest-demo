(function (e) {
    "use strict";
    if (typeof define === "function" && define.amd) {
        define(["jquery", "jquery.ui.widget"], e)
    } else {
        e(window.jQuery)
    }
})(function (e) {
    "use strict";
    e.support.xhrFileUpload = !!(window.XMLHttpRequestUpload && window.FileReader);
    e.support.xhrFormDataFileUpload = !!window.FormData;
    e.widget("blueimp.fileupload", {
        options: {
            dropZone: e(document),
            pasteZone: e(document),
            fileInput: undefined,
            replaceFileInput: true,
            paramName: undefined,
            singleFileUploads: true,
            limitMultiFileUploads: undefined,
            sequentialUploads: false,
            limitConcurrentUploads: undefined,
            forceIframeTransport: false,
            redirect: undefined,
            redirectParamName: undefined,
            postMessage: undefined,
            multipart: true,
            maxChunkSize: undefined,
            uploadedBytes: undefined,
            recalculateProgress: true,
            progressInterval: 100,
            bitrateInterval: 500,
            autoUpload: true,
            formData: function (e) {
                return e.serializeArray()
            },
            add: function (t, n) {
                if (n.autoUpload || n.autoUpload !== false && (e(this).data("blueimp-fileupload") || e(this).data("fileupload")).options.autoUpload) {
                    n.submit()
                }
            },
            processData: false,
            contentType: false,
            cache: false
        },
        _refreshOptionsList: ["fileInput", "dropZone", "pasteZone", "multipart", "forceIframeTransport"],
        _BitrateTimer: function () {
            this.timestamp = Date.now ? Date.now() : (new Date).getTime();
            this.loaded = 0;
            this.bitrate = 0;
            this.getBitrate = function (e, t, n) {
                var r = e - this.timestamp;
                if (!this.bitrate || !n || r > n) {
                    this.bitrate = (t - this.loaded) * (1e3 / r) * 8;
                    this.loaded = t;
                    this.timestamp = e
                }
                return this.bitrate
            }
        },
        _isXHRUpload: function (t) {
            return !t.forceIframeTransport && (!t.multipart && e.support.xhrFileUpload || e.support.xhrFormDataFileUpload)
        },
        _getFormData: function (t) {
            var n;
            if (typeof t.formData === "function") {
                return t.formData(t.form)
            }
            if (e.isArray(t.formData)) {
                return t.formData
            }
            if (e.type(t.formData) === "object") {
                n = [];
                e.each(t.formData, function (e, t) {
                    n.push({name: e, value: t})
                });
                return n
            }
            return []
        },
        _getTotal: function (t) {
            var n = 0;
            e.each(t, function (e, t) {
                n += t.size || 1
            });
            return n
        },
        _initProgressObject: function (t) {
            var n = {loaded: 0, total: 0, bitrate: 0};
            if (t._progress) {
                e.extend(t._progress, n)
            } else {
                t._progress = n
            }
        },
        _initResponseObject: function (e) {
            var t;
            if (e._response) {
                for (t in e._response) {
                    if (e._response.hasOwnProperty(t)) {
                        delete e._response[t]
                    }
                }
            } else {
                e._response = {}
            }
        },
        _onProgress: function (e, t) {
            if (e.lengthComputable) {
                var n = Date.now ? Date.now() : (new Date).getTime(), r;
                if (t._time && t.progressInterval && n - t._time < t.progressInterval && e.loaded !== e.total) {
                    return
                }
                t._time = n;
                r = Math.floor(e.loaded / e.total * (t.chunkSize || t._progress.total)) + (t.uploadedBytes || 0);
                this._progress.loaded += r - t._progress.loaded;
                this._progress.bitrate = this._bitrateTimer.getBitrate(n, this._progress.loaded, t.bitrateInterval);
                t._progress.loaded = t.loaded = r;
                t._progress.bitrate = t.bitrate = t._bitrateTimer.getBitrate(n, r, t.bitrateInterval);
                this._trigger("progress", e, t);
                this._trigger("progressall", e, this._progress)
            }
        },
        _initProgressListener: function (t) {
            var n = this, r = t.xhr ? t.xhr() : e.ajaxSettings.xhr();
            if (r.upload) {
                e(r.upload).bind("progress", function (e) {
                    var r = e.originalEvent;
                    e.lengthComputable = r.lengthComputable;
                    e.loaded = r.loaded;
                    e.total = r.total;
                    n._onProgress(e, t)
                });
                t.xhr = function () {
                    return r
                }
            }
        },
        _initXHRData: function (t) {
            var n, r = t.files[0], i = t.multipart || !e.support.xhrFileUpload, s = t.paramName[0];
            t.headers = t.headers || {};
            if (t.contentRange) {
                t.headers["Content-Range"] = t.contentRange
            }
            if (!i) {
                t.headers["Content-Disposition"] = 'attachment; filename="' + encodeURI(r.name) + '"';
                t.contentType = r.type;
                t.data = t.blob || r
            } else if (e.support.xhrFormDataFileUpload) {
                if (t.postMessage) {
                    n = this._getFormData(t);
                    if (t.blob) {
                        n.push({name: s, value: t.blob})
                    } else {
                        e.each(t.files, function (e, r) {
                            n.push({name: t.paramName[e] || s, value: r})
                        })
                    }
                } else {
                    if (t.formData instanceof FormData) {
                        n = t.formData
                    } else {
                        n = new FormData;
                        e.each(this._getFormData(t), function (e, t) {
                            n.append(t.name, t.value)
                        })
                    }
                    if (t.blob) {
                        t.headers["Content-Disposition"] = 'attachment; filename="' + encodeURI(r.name) + '"';
                        n.append(s, t.blob, r.name)
                    } else {
                        e.each(t.files, function (e, r) {
                            if (window.Blob && r instanceof Blob || window.File && r instanceof File) {
                                n.append(t.paramName[e] || s, r, r.name)
                            }
                        })
                    }
                }
                t.data = n
            }
            t.blob = null
        },
        _initIframeSettings: function (t) {
            t.dataType = "iframe " + (t.dataType || "");
            t.formData = this._getFormData(t);
            if (t.redirect && e("<a></a>").prop("href", t.url).prop("host") !== location.host) {
                t.formData.push({name: t.redirectParamName || "redirect", value: t.redirect})
            }
        },
        _initDataSettings: function (e) {
            if (this._isXHRUpload(e)) {
                if (!this._chunkedUpload(e, true)) {
                    if (!e.data) {
                        this._initXHRData(e)
                    }
                    this._initProgressListener(e)
                }
                if (e.postMessage) {
                    e.dataType = "postmessage " + (e.dataType || "")
                }
            } else {
                this._initIframeSettings(e, "iframe")
            }
        },
        _getParamName: function (t) {
            var n = e(t.fileInput), r = t.paramName;
            if (!r) {
                r = [];
                n.each(function () {
                    var t = e(this), n = t.prop("name") || "files[]", i = (t.prop("files") || [1]).length;
                    while (i) {
                        r.push(n);
                        i -= 1
                    }
                });
                if (!r.length) {
                    r = [n.prop("name") || "files[]"]
                }
            } else if (!e.isArray(r)) {
                r = [r]
            }
            return r
        },
        _initFormSettings: function (t) {
            if (!t.form || !t.form.length) {
                t.form = e(t.fileInput.prop("form"));
                if (!t.form.length) {
                    t.form = e(this.options.fileInput.prop("form"))
                }
            }
            t.paramName = this._getParamName(t);
            if (!t.url) {
                t.url = t.form.prop("action") || location.href
            }
            t.type = (t.type || t.form.prop("method") || "").toUpperCase();
            if (t.type !== "POST" && t.type !== "PUT" && t.type !== "PATCH") {
                t.type = "POST"
            }
            if (!t.formAcceptCharset) {
                t.formAcceptCharset = t.form.attr("accept-charset")
            }
        },
        _getAJAXSettings: function (t) {
            var n = e.extend({}, this.options, t);
            this._initFormSettings(n);
            this._initDataSettings(n);
            return n
        },
        _getDeferredState: function (e) {
            if (e.state) {
                return e.state()
            }
            if (e.isResolved()) {
                return "resolved"
            }
            if (e.isRejected()) {
                return "rejected"
            }
            return "pending"
        },
        _enhancePromise: function (e) {
            e.success = e.done;
            e.error = e.fail;
            e.complete = e.always;
            return e
        },
        _getXHRPromise: function (t, n, r) {
            var i = e.Deferred(), s = i.promise();
            n = n || this.options.context || s;
            if (t === true) {
                i.resolveWith(n, r)
            } else if (t === false) {
                i.rejectWith(n, r)
            }
            s.abort = i.promise;
            return this._enhancePromise(s)
        },
        _addConvenienceMethods: function (e, t) {
            var n = this;
            t.submit = function () {
                if (this.state() !== "pending") {
                    t.jqXHR = this.jqXHR = n._trigger("submit", e, this) !== false && n._onSend(e, this)
                }
                return this.jqXHR || n._getXHRPromise()
            };
            t.abort = function () {
                if (this.jqXHR) {
                    return this.jqXHR.abort()
                }
                return n._getXHRPromise()
            };
            t.state = function () {
                if (this.jqXHR) {
                    return n._getDeferredState(this.jqXHR)
                }
            };
            t.progress = function () {
                return this._progress
            };
            t.response = function () {
                return this._response
            }
        },
        _getUploadedBytes: function (e) {
            var t = e.getResponseHeader("Range"), n = t && t.split("-"), r = n && n.length > 1 && parseInt(n[1], 10);
            return r && r + 1
        },
        _chunkedUpload: function (t, n) {
            var r = this, i = t.files[0], s = i.size, o = t.uploadedBytes = t.uploadedBytes || 0, u = t.maxChunkSize || s, a = i.slice || i.webkitSlice || i.mozSlice, f = e.Deferred(), l = f.promise(), c, h;
            if (!(this._isXHRUpload(t) && a && (o || u < s)) || t.data) {
                return false
            }
            if (n) {
                return true
            }
            if (o >= s) {
                i.error = "Uploaded bytes exceed file size";
                return this._getXHRPromise(false, t.context, [null, "error", i.error])
            }
            h = function () {
                var n = e.extend({}, t), l = n._progress.loaded;
                n.blob = a.call(i, o, o + u, i.type);
                n.chunkSize = n.blob.size;
                n.contentRange = "bytes " + o + "-" + (o + n.chunkSize - 1) + "/" + s;
                r._initXHRData(n);
                r._initProgressListener(n);
                c = (r._trigger("chunksend", null, n) !== false && e.ajax(n) || r._getXHRPromise(false, n.context)).done(function (i, u, a) {
                    o = r._getUploadedBytes(a) || o + n.chunkSize;
                    if (n._progress.loaded === l) {
                        r._onProgress(e.Event("progress", {
                            lengthComputable: true,
                            loaded: o - n.uploadedBytes,
                            total: o - n.uploadedBytes
                        }), n)
                    }
                    t.uploadedBytes = n.uploadedBytes = o;
                    n.result = i;
                    n.textStatus = u;
                    n.jqXHR = a;
                    r._trigger("chunkdone", null, n);
                    r._trigger("chunkalways", null, n);
                    if (o < s) {
                        h()
                    } else {
                        f.resolveWith(n.context, [i, u, a])
                    }
                }).fail(function (e, t, i) {
                    n.jqXHR = e;
                    n.textStatus = t;
                    n.errorThrown = i;
                    r._trigger("chunkfail", null, n);
                    r._trigger("chunkalways", null, n);
                    f.rejectWith(n.context, [e, t, i])
                })
            };
            this._enhancePromise(l);
            l.abort = function () {
                return c.abort()
            };
            h();
            return l
        },
        _beforeSend: function (e, t) {
            if (this._active === 0) {
                this._trigger("start");
                this._bitrateTimer = new this._BitrateTimer;
                this._progress.loaded = this._progress.total = 0;
                this._progress.bitrate = 0
            }
            this._initResponseObject(t);
            this._initProgressObject(t);
            t._progress.loaded = t.loaded = t.uploadedBytes || 0;
            t._progress.total = t.total = this._getTotal(t.files) || 1;
            t._progress.bitrate = t.bitrate = 0;
            this._active += 1;
            this._progress.loaded += t.loaded;
            this._progress.total += t.total
        },
        _onDone: function (t, n, r, i) {
            var s = i._progress.total, o = i._response;
            if (i._progress.loaded < s) {
                this._onProgress(e.Event("progress", {lengthComputable: true, loaded: s, total: s}), i)
            }
            o.result = i.result = t;
            o.textStatus = i.textStatus = n;
            o.jqXHR = i.jqXHR = r;
            this._trigger("done", null, i)
        },
        _onFail: function (e, t, n, r) {
            var i = r._response;
            if (r.recalculateProgress) {
                this._progress.loaded -= r._progress.loaded;
                this._progress.total -= r._progress.total
            }
            i.jqXHR = r.jqXHR = e;
            i.textStatus = r.textStatus = t;
            i.errorThrown = r.errorThrown = n;
            this._trigger("fail", null, r)
        },
        _onAlways: function (e, t, n, r) {
            this._trigger("always", null, r)
        },
        _onSend: function (t, n) {
            if (!n.submit) {
                this._addConvenienceMethods(t, n)
            }
            var r = this, i, s, o, u, a = r._getAJAXSettings(n), f = function () {
                r._sending += 1;
                a._bitrateTimer = new r._BitrateTimer;
                i = i || ((s || r._trigger("send", t, a) === false) && r._getXHRPromise(false, a.context, s) || r._chunkedUpload(a) || e.ajax(a)).done(function (e, t, n) {
                        r._onDone(e, t, n, a)
                    }).fail(function (e, t, n) {
                        r._onFail(e, t, n, a)
                    }).always(function (e, t, n) {
                        r._onAlways(e, t, n, a);
                        r._sending -= 1;
                        r._active -= 1;
                        if (a.limitConcurrentUploads && a.limitConcurrentUploads > r._sending) {
                            var i = r._slots.shift();
                            while (i) {
                                if (r._getDeferredState(i) === "pending") {
                                    i.resolve();
                                    break
                                }
                                i = r._slots.shift()
                            }
                        }
                        if (r._active === 0) {
                            r._trigger("stop")
                        }
                    });
                return i
            };
            this._beforeSend(t, a);
            if (this.options.sequentialUploads || this.options.limitConcurrentUploads && this.options.limitConcurrentUploads <= this._sending) {
                if (this.options.limitConcurrentUploads > 1) {
                    o = e.Deferred();
                    this._slots.push(o);
                    u = o.pipe(f)
                } else {
                    u = this._sequence = this._sequence.pipe(f, f)
                }
                u.abort = function () {
                    s = [undefined, "abort", "abort"];
                    if (!i) {
                        if (o) {
                            o.rejectWith(a.context, s)
                        }
                        return f()
                    }
                    return i.abort()
                };
                return this._enhancePromise(u)
            }
            return f()
        },
        _onAdd: function (t, n) {
            var r = this, i = true, s = e.extend({}, this.options, n), o = s.limitMultiFileUploads, u = this._getParamName(s), a, f, l, c;
            if (!(s.singleFileUploads || o) || !this._isXHRUpload(s)) {
                l = [n.files];
                a = [u]
            } else if (!s.singleFileUploads && o) {
                l = [];
                a = [];
                for (c = 0; c < n.files.length; c += o) {
                    l.push(n.files.slice(c, c + o));
                    f = u.slice(c, c + o);
                    if (!f.length) {
                        f = u
                    }
                    a.push(f)
                }
            } else {
                a = u
            }
            n.originalFiles = n.files;
            e.each(l || n.files, function (s, o) {
                var u = e.extend({}, n);
                u.files = l ? o : [o];
                u.paramName = a[s];
                r._initResponseObject(u);
                r._initProgressObject(u);
                r._addConvenienceMethods(t, u);
                i = r._trigger("add", t, u);
                return i
            });
            return i
        },
        _replaceFileInput: function (t) {
            var n = t.clone(true);
            e("<form></form>").append(n)[0].reset();
            t.after(n).detach();
            e.cleanData(t.unbind("remove"));
            this.options.fileInput = this.options.fileInput.map(function (e, r) {
                if (r === t[0]) {
                    return n[0]
                }
                return r
            });
            if (t[0] === this.element[0]) {
                this.element = n
            }
        },
        _handleFileTreeEntry: function (t, n) {
            var r = this, i = e.Deferred(), s = function (e) {
                if (e && !e.entry) {
                    e.entry = t
                }
                i.resolve([e])
            }, o;
            n = n || "";
            if (t.isFile) {
                if (t._file) {
                    t._file.relativePath = n;
                    i.resolve(t._file)
                } else {
                    t.file(function (e) {
                        e.relativePath = n;
                        i.resolve(e)
                    }, s)
                }
            } else if (t.isDirectory) {
                o = t.createReader();
                o.readEntries(function (e) {
                    r._handleFileTreeEntries(e, n + t.name + "/").done(function (e) {
                        i.resolve(e)
                    }).fail(s)
                }, s)
            } else {
                i.resolve([])
            }
            return i.promise()
        },
        _handleFileTreeEntries: function (t, n) {
            var r = this;
            return e.when.apply(e, e.map(t, function (e) {
                return r._handleFileTreeEntry(e, n)
            })).pipe(function () {
                return Array.prototype.concat.apply([], arguments)
            })
        },
        _getDroppedFiles: function (t) {
            t = t || {};
            var n = t.items;
            if (n && n.length && (n[0].webkitGetAsEntry || n[0].getAsEntry)) {
                return this._handleFileTreeEntries(e.map(n, function (e) {
                    var t;
                    if (e.webkitGetAsEntry) {
                        t = e.webkitGetAsEntry();
                        if (t) {
                            t._file = e.getAsFile()
                        }
                        return t
                    }
                    return e.getAsEntry()
                }))
            }
            return e.Deferred().resolve(e.makeArray(t.files)).promise()
        },
        _getSingleFileInputFiles: function (t) {
            t = e(t);
            var n = t.prop("webkitEntries") || t.prop("entries"), r, i;
            if (n && n.length) {
                return this._handleFileTreeEntries(n)
            }
            r = e.makeArray(t.prop("files"));
            if (!r.length) {
                i = t.prop("value");
                if (!i) {
                    return e.Deferred().resolve([]).promise()
                }
                r = [{name: i.replace(/^.*\\/, "")}]
            } else if (r[0].name === undefined && r[0].fileName) {
                e.each(r, function (e, t) {
                    t.name = t.fileName;
                    t.size = t.fileSize
                })
            }
            return e.Deferred().resolve(r).promise()
        },
        _getFileInputFiles: function (t) {
            if (!(t instanceof e) || t.length === 1) {
                return this._getSingleFileInputFiles(t)
            }
            return e.when.apply(e, e.map(t, this._getSingleFileInputFiles)).pipe(function () {
                return Array.prototype.concat.apply([], arguments)
            })
        },
        _onChange: function (t) {
            var n = this, r = {fileInput: e(t.target), form: e(t.target.form)};
            this._getFileInputFiles(r.fileInput).always(function (e) {
                r.files = e;
                if (n.options.replaceFileInput) {
                    n._replaceFileInput(r.fileInput)
                }
                if (n._trigger("change", t, r) !== false) {
                    n._onAdd(t, r)
                }
            })
        },
        _onPaste: function (t) {
            var n = t.originalEvent.clipboardData, r = n && n.items || [], i = {files: []};
            e.each(r, function (e, t) {
                var n = t.getAsFile && t.getAsFile();
                if (n) {
                    i.files.push(n)
                }
            });
            if (this._trigger("paste", t, i) === false || this._onAdd(t, i) === false) {
                return false
            }
        },
        _onDrop: function (e) {
            var t = this, n = e.dataTransfer = e.originalEvent.dataTransfer, r = {};
            if (n && n.files && n.files.length) {
                e.preventDefault()
            }
            this._getDroppedFiles(n).always(function (n) {
                r.files = n;
                if (t._trigger("drop", e, r) !== false) {
                    t._onAdd(e, r)
                }
            })
        },
        _onDragOver: function (t) {
            var n = t.dataTransfer = t.originalEvent.dataTransfer;
            if (this._trigger("dragover", t) === false) {
                return false
            }
            if (n && e.inArray("Files", n.types) !== -1) {
                n.dropEffect = "copy";
                t.preventDefault()
            }
        },
        _initEventHandlers: function () {
            if (this._isXHRUpload(this.options)) {
                this._on(this.options.dropZone, {dragover: this._onDragOver, drop: this._onDrop});
                this._on(this.options.pasteZone, {paste: this._onPaste})
            }
            this._on(this.options.fileInput, {change: this._onChange})
        },
        _destroyEventHandlers: function () {
            this._off(this.options.dropZone, "dragover drop");
            this._off(this.options.pasteZone, "paste");
            this._off(this.options.fileInput, "change")
        },
        _setOption: function (t, n) {
            var r = e.inArray(t, this._refreshOptionsList) !== -1;
            if (r) {
                this._destroyEventHandlers()
            }
            this._super(t, n);
            if (r) {
                this._initSpecialOptions();
                this._initEventHandlers()
            }
        },
        _initSpecialOptions: function () {
            var t = this.options;
            if (t.fileInput === undefined) {
                t.fileInput = this.element.is('input[type="file"]') ? this.element : this.element.find('input[type="file"]')
            } else if (!(t.fileInput instanceof e)) {
                t.fileInput = e(t.fileInput)
            }
            if (!(t.dropZone instanceof e)) {
                t.dropZone = e(t.dropZone)
            }
            if (!(t.pasteZone instanceof e)) {
                t.pasteZone = e(t.pasteZone)
            }
        },
        _create: function () {
            var t = this.options;
            e.extend(t, e(this.element[0].cloneNode(false)).data());
            this._initSpecialOptions();
            this._slots = [];
            this._sequence = this._getXHRPromise(true);
            this._sending = this._active = 0;
            this._initProgressObject(this);
            this._initEventHandlers()
        },
        active: function () {
            return this._active
        },
        progress: function () {
            return this._progress
        },
        add: function (t) {
            var n = this;
            if (!t || this.options.disabled) {
                return
            }
            if (t.fileInput && !t.files) {
                this._getFileInputFiles(t.fileInput).always(function (e) {
                    t.files = e;
                    n._onAdd(null, t)
                })
            } else {
                t.files = e.makeArray(t.files);
                this._onAdd(null, t)
            }
        },
        send: function (t) {
            if (t && !this.options.disabled) {
                if (t.fileInput && !t.files) {
                    var n = this, r = e.Deferred(), i = r.promise(), s, o;
                    i.abort = function () {
                        o = true;
                        if (s) {
                            return s.abort()
                        }
                        r.reject(null, "abort", "abort");
                        return i
                    };
                    this._getFileInputFiles(t.fileInput).always(function (e) {
                        if (o) {
                            return
                        }
                        t.files = e;
                        s = n._onSend(null, t).then(function (e, t, n) {
                            r.resolve(e, t, n)
                        }, function (e, t, n) {
                            r.reject(e, t, n)
                        })
                    });
                    return this._enhancePromise(i)
                }
                t.files = e.makeArray(t.files);
                if (t.files.length) {
                    return this._onSend(null, t)
                }
            }
            return this._getXHRPromise(false, t && t.context)
        }
    })
})