(function (e) {
    "use strict";
    if (typeof define === "function" && define.amd) {
        define(["jquery", "tmpl", "load-image", "./jquery.fileupload-fp"], e)
    } else {
        e(window.jQuery, window.tmpl, window.loadImage)
    }
})(function (e, t, n) {
    "use strict";
    e.widget("blueimp.fileupload", e.blueimp.fileupload, {
        options: {
            autoUpload: false,
            maxNumberOfFiles: undefined,
            maxFileSize: undefined,
            minFileSize: undefined,
            acceptFileTypes: /.+$/i,
            previewSourceFileTypes: /^image\/(gif|jpeg|png)$/,
            previewSourceMaxFileSize: 5e6,
            previewMaxWidth: 80,
            previewMaxHeight: 80,
            previewAsCanvas: true,
            uploadTemplateId: "template-upload",
            downloadTemplateId: "template-download",
            filesContainer: undefined,
            prependFiles: false,
            dataType: "json",
            add: function (t, n) {
                var r = e(this).data("blueimp-fileupload") || e(this).data("fileupload"), i = r.options, s = n.files;
                e(this).fileupload("process", n).done(function () {
                    r._adjustMaxNumberOfFiles(-s.length);
                    n.maxNumberOfFilesAdjusted = true;
                    n.files.valid = n.isValidated = r._validate(s);
                    n.context = r._renderUpload(s).data("data", n);
                    i.filesContainer[i.prependFiles ? "prepend" : "append"](n.context);
                    r._renderPreviews(n);
                    r._forceReflow(n.context);
                    r._transition(n.context).done(function () {
                        if (r._trigger("added", t, n) !== false && (i.autoUpload || n.autoUpload) && n.autoUpload !== false && n.isValidated) {
                            n.submit()
                        }
                    })
                })
            },
            send: function (t, n) {
                var r = e(this).data("blueimp-fileupload") || e(this).data("fileupload");
                if (!n.isValidated) {
                    if (!n.maxNumberOfFilesAdjusted) {
                        r._adjustMaxNumberOfFiles(-n.files.length);
                        n.maxNumberOfFilesAdjusted = true
                    }
                    if (!r._validate(n.files)) {
                        return false
                    }
                }
                if (n.context && n.dataType && n.dataType.substr(0, 6) === "iframe") {
                    n.context.find(".progress").addClass(!e.support.transition && "progress-animated").attr("aria-valuenow", 100).find(".bar").css("width", "100%")
                }
                return r._trigger("sent", t, n)
            },
            done: function (t, n) {
                var r = e(this).data("blueimp-fileupload") || e(this).data("fileupload"), i = r._getFilesFromResponse(n), s, o;
                if (n.context) {
                    n.context.each(function (o) {
                        var u = i[o] || {error: "Empty file upload result"}, a = r._addFinishedDeferreds();
                        if (u.error) {
                            r._adjustMaxNumberOfFiles(1)
                        }
                        r._transition(e(this)).done(function () {
                            var i = e(this);
                            s = r._renderDownload([u]).replaceAll(i);
                            r._forceReflow(s);
                            r._transition(s).done(function () {
                                n.context = e(this);
                                r._trigger("completed", t, n);
                                r._trigger("finished", t, n);
                                a.resolve()
                            })
                        })
                    })
                } else {
                    if (i.length) {
                        e.each(i, function (e, t) {
                            if (n.maxNumberOfFilesAdjusted && t.error) {
                                r._adjustMaxNumberOfFiles(1)
                            } else if (!n.maxNumberOfFilesAdjusted && !t.error) {
                                r._adjustMaxNumberOfFiles(-1)
                            }
                        });
                        n.maxNumberOfFilesAdjusted = true
                    }
                    s = r._renderDownload(i).appendTo(r.options.filesContainer);
                    r._forceReflow(s);
                    o = r._addFinishedDeferreds();
                    r._transition(s).done(function () {
                        n.context = e(this);
                        r._trigger("completed", t, n);
                        r._trigger("finished", t, n);
                        o.resolve()
                    })
                }
            },
            fail: function (t, n) {
                var r = e(this).data("blueimp-fileupload") || e(this).data("fileupload"), i, s;
                if (n.maxNumberOfFilesAdjusted) {
                    r._adjustMaxNumberOfFiles(n.files.length)
                }
                if (n.context) {
                    n.context.each(function (o) {
                        if (n.errorThrown !== "abort") {
                            var u = n.files[o];
                            u.error = u.error || n.errorThrown || true;
                            s = r._addFinishedDeferreds();
                            r._transition(e(this)).done(function () {
                                var o = e(this);
                                i = r._renderDownload([u]).replaceAll(o);
                                r._forceReflow(i);
                                r._transition(i).done(function () {
                                    n.context = e(this);
                                    r._trigger("failed", t, n);
                                    r._trigger("finished", t, n);
                                    s.resolve()
                                })
                            })
                        } else {
                            s = r._addFinishedDeferreds();
                            r._transition(e(this)).done(function () {
                                e(this).remove();
                                r._trigger("failed", t, n);
                                r._trigger("finished", t, n);
                                s.resolve()
                            })
                        }
                    })
                } else if (n.errorThrown !== "abort") {
                    n.context = r._renderUpload(n.files).appendTo(r.options.filesContainer).data("data", n);
                    r._forceReflow(n.context);
                    s = r._addFinishedDeferreds();
                    r._transition(n.context).done(function () {
                        n.context = e(this);
                        r._trigger("failed", t, n);
                        r._trigger("finished", t, n);
                        s.resolve()
                    })
                } else {
                    r._trigger("failed", t, n);
                    r._trigger("finished", t, n);
                    r._addFinishedDeferreds().resolve()
                }
            },
            progress: function (e, t) {
                if (t.context) {
                    var n = Math.floor(t.loaded / t.total * 100);
                    t.context.find(".progress").attr("aria-valuenow", n).find(".bar").css("width", n + "%")
                }
            },
            progressall: function (t, n) {
                var r = e(this), i = Math.floor(n.loaded / n.total * 100), s = r.find(".fileupload-progress"), o = s.find(".progress-extended");
                if (o.length) {
                    o.html((r.data("blueimp-fileupload") || r.data("fileupload"))._renderExtendedProgress(n))
                }
                s.find(".progress").attr("aria-valuenow", i).find(".bar").css("width", i + "%")
            },
            start: function (t) {
                var n = e(this).data("blueimp-fileupload") || e(this).data("fileupload");
                n._resetFinishedDeferreds();
                n._transition(e(this).find(".fileupload-progress")).done(function () {
                    n._trigger("started", t)
                })
            },
            stop: function (t) {
                var n = e(this).data("blueimp-fileupload") || e(this).data("fileupload"), r = n._addFinishedDeferreds();
                e.when.apply(e, n._getFinishedDeferreds()).done(function () {
                    n._trigger("stopped", t)
                });
                n._transition(e(this).find(".fileupload-progress")).done(function () {
                    e(this).find(".progress").attr("aria-valuenow", "0").find(".bar").css("width", "0%");
                    e(this).find(".progress-extended").html("Â ");
                    r.resolve()
                })
            },
            destroy: function (t, n) {
                var r = e(this).data("blueimp-fileupload") || e(this).data("fileupload");
                if (n.url) {
                    e.ajax(n).done(function () {
                        r._transition(n.context).done(function () {
                            e(this).remove();
                            r._trigger("destroyed", t, n)
                        })
                    });
                    r._adjustMaxNumberOfFiles(1)
                }
            }
        }, _resetFinishedDeferreds: function () {
            this._finishedUploads = []
        }, _addFinishedDeferreds: function (t) {
            if (!t) {
                t = e.Deferred()
            }
            this._finishedUploads.push(t);
            return t
        }, _getFinishedDeferreds: function () {
            return this._finishedUploads
        }, _getFilesFromResponse: function (t) {
            if (t.result && e.isArray(t.result.files)) {
                return t.result.files
            }
            return []
        }, _enableDragToDesktop: function () {
            var t = e(this), n = t.prop("href"), r = t.prop("download"), i = "application/octet-stream";
            t.bind("dragstart", function (e) {
                try {
                    e.originalEvent.dataTransfer.setData("DownloadURL", [i, r, n].join(":"))
                } catch (t) {
                }
            })
        }, _adjustMaxNumberOfFiles: function (e) {
            if (typeof this.options.maxNumberOfFiles === "number") {
                this.options.maxNumberOfFiles += e;
                if (this.options.maxNumberOfFiles < 1) {
                    this._disableFileInputButton()
                } else {
                    this._enableFileInputButton()
                }
            }
        }, _formatFileSize: function (e) {
            if (typeof e !== "number") {
                return ""
            }
            if (e >= 1e9) {
                return (e / 1e9).toFixed(2) + " GB"
            }
            if (e >= 1e6) {
                return (e / 1e6).toFixed(2) + " MB"
            }
            return (e / 1e3).toFixed(2) + " KB"
        }, _formatBitrate: function (e) {
            if (typeof e !== "number") {
                return ""
            }
            if (e >= 1e9) {
                return (e / 1e9).toFixed(2) + " Gbit/s"
            }
            if (e >= 1e6) {
                return (e / 1e6).toFixed(2) + " Mbit/s"
            }
            if (e >= 1e3) {
                return (e / 1e3).toFixed(2) + " kbit/s"
            }
            return e.toFixed(2) + " bit/s"
        }, _formatTime: function (e) {
            var t = new Date(e * 1e3), n = Math.floor(e / 86400);
            n = n ? n + "d " : "";
            return n + ("0" + t.getUTCHours()).slice(-2) + ":" + ("0" + t.getUTCMinutes()).slice(-2) + ":" + ("0" + t.getUTCSeconds()).slice(-2)
        }, _formatPercentage: function (e) {
            return (e * 100).toFixed(2) + " %"
        }, _renderExtendedProgress: function (e) {
            return this._formatBitrate(e.bitrate) + " | " + this._formatTime((e.total - e.loaded) * 8 / e.bitrate) + " | " + this._formatPercentage(e.loaded / e.total) + " | " + this._formatFileSize(e.loaded) + " / " + this._formatFileSize(e.total)
        }, _hasError: function (e) {
            if (e.error) {
                return e.error
            }
            if (this.options.maxNumberOfFiles < 0) {
                return "Maximum number of files exceeded"
            }
            if (!(this.options.acceptFileTypes.test(e.type) || this.options.acceptFileTypes.test(e.name))) {
                return "Filetype not allowed"
            }
            if (this.options.maxFileSize && e.size > this.options.maxFileSize) {
                return "File is too big"
            }
            if (typeof e.size === "number" && e.size < this.options.minFileSize) {
                return "File is too small"
            }
            return null
        }, _validate: function (t) {
            var n = this, r = !!t.length;
            e.each(t, function (e, t) {
                t.error = n._hasError(t);
                if (t.error) {
                    r = false
                }
            });
            return r
        }, _renderTemplate: function (t, n) {
            if (!t) {
                return e()
            }
            var r = t({files: n, formatFileSize: this._formatFileSize, options: this.options});
            if (r instanceof e) {
                return r
            }
            return e(this.options.templatesContainer).html(r).children()
        }, _renderPreview: function (t, r) {
            var i = this, s = this.options, o = e.Deferred();
            return (n && n(t, function (t) {
                    r.append(t);
                    i._forceReflow(r);
                    i._transition(r).done(function () {
                        o.resolveWith(r)
                    });
                    if (!e.contains(i.document[0].body, r[0])) {
                        o.resolveWith(r)
                    }
                    r.on("remove", function () {
                        o.resolveWith(r)
                    })
                }, {
                    maxWidth: s.previewMaxWidth,
                    maxHeight: s.previewMaxHeight,
                    canvas: s.previewAsCanvas
                }) || o.resolveWith(r)) && o
        }, _renderPreviews: function (t) {
            var n = this, r = this.options;
            t.context.find(".preview span").each(function (i, s) {
                var o = t.files[i];
                if (r.previewSourceFileTypes.test(o.type) && (e.type(r.previewSourceMaxFileSize) !== "number" || o.size < r.previewSourceMaxFileSize)) {
                    n._processingQueue = n._processingQueue.pipe(function () {
                        var r = e.Deferred(), i = e.Event("previewdone", {target: s});
                        n._renderPreview(o, e(s)).done(function () {
                            n._trigger(i.type, i, t);
                            r.resolveWith(n)
                        });
                        return r.promise()
                    })
                }
            });
            return this._processingQueue
        }, _renderUpload: function (e) {
            return this._renderTemplate(this.options.uploadTemplate, e)
        }, _renderDownload: function (e) {
            return this._renderTemplate(this.options.downloadTemplate, e).find("a[download]").each(this._enableDragToDesktop).end()
        }, _startHandler: function (t) {
            t.preventDefault();
            var n = e(t.currentTarget), r = n.closest(".template-upload"), i = r.data("data");
            if (i && i.submit && !i.jqXHR && i.submit()) {
                n.prop("disabled", true)
            }
        }, _cancelHandler: function (t) {
            t.preventDefault();
            var n = e(t.currentTarget).closest(".template-upload"), r = n.data("data") || {};
            if (!r.jqXHR) {
                r.errorThrown = "abort";
                this._trigger("fail", t, r)
            } else {
                r.jqXHR.abort()
            }
        }, _deleteHandler: function (t) {
            t.preventDefault();
            var n = e(t.currentTarget);
            this._trigger("destroy", t, e.extend({
                context: n.closest(".template-download"),
                type: "DELETE",
                dataType: this.options.dataType
            }, n.data()))
        }, _forceReflow: function (t) {
            return e.support.transition && t.length && t[0].offsetWidth
        }, _transition: function (t) {
            var n = e.Deferred();
            if (e.support.transition && t.hasClass("fade") && t.is(":visible")) {
                t.bind(e.support.transition.end, function (r) {
                    if (r.target === t[0]) {
                        t.unbind(e.support.transition.end);
                        n.resolveWith(t)
                    }
                }).toggleClass("in")
            } else {
                t.toggleClass("in");
                n.resolveWith(t)
            }
            return n
        }, _initButtonBarEventHandlers: function () {
            var t = this.element.find(".fileupload-buttonbar"), n = this.options.filesContainer;
            this._on(t.find(".start"), {
                click: function (e) {
                    e.preventDefault();
                    n.find(".start").click()
                }
            });
            this._on(t.find(".cancel"), {
                click: function (e) {
                    e.preventDefault();
                    n.find(".cancel").click()
                }
            });
            this._on(t.find(".delete"), {
                click: function (e) {
                    e.preventDefault();
                    n.find(".toggle:checked").closest(".template-download").find(".delete").click();
                    t.find(".toggle").prop("checked", false)
                }
            });
            this._on(t.find(".toggle"), {
                change: function (t) {
                    n.find(".toggle").prop("checked", e(t.currentTarget).is(":checked"))
                }
            })
        }, _destroyButtonBarEventHandlers: function () {
            this._off(this.element.find(".fileupload-buttonbar").find(".start, .cancel, .delete"), "click");
            this._off(this.element.find(".fileupload-buttonbar .toggle"), "change.")
        }, _initEventHandlers: function () {
            this._super();
            this._on(this.options.filesContainer, {
                "click .start": this._startHandler,
                "click .cancel": this._cancelHandler,
                "click .delete": this._deleteHandler
            });
            this._initButtonBarEventHandlers()
        }, _destroyEventHandlers: function () {
            this._destroyButtonBarEventHandlers();
            this._off(this.options.filesContainer, "click");
            this._super()
        }, _enableFileInputButton: function () {
            this.element.find(".fileinput-button input").prop("disabled", false).parent().removeClass("disabled")
        }, _disableFileInputButton: function () {
            this.element.find(".fileinput-button input").prop("disabled", true).parent().addClass("disabled")
        }, _initTemplates: function () {
            var e = this.options;
            e.templatesContainer = this.document[0].createElement(e.filesContainer.prop("nodeName"));
            if (t) {
                if (e.uploadTemplateId) {
                    e.uploadTemplate = t(e.uploadTemplateId)
                }
                if (e.downloadTemplateId) {
                    e.downloadTemplate = t(e.downloadTemplateId)
                }
            }
        }, _initFilesContainer: function () {
            var t = this.options;
            if (t.filesContainer === undefined) {
                t.filesContainer = this.element.find(".files")
            } else if (!(t.filesContainer instanceof e)) {
                t.filesContainer = e(t.filesContainer)
            }
        }, _stringToRegExp: function (e) {
            var t = e.split("/"), n = t.pop();
            t.shift();
            return new RegExp(t.join("/"), n)
        }, _initRegExpOptions: function () {
            var t = this.options;
            if (e.type(t.acceptFileTypes) === "string") {
                t.acceptFileTypes = this._stringToRegExp(t.acceptFileTypes)
            }
            if (e.type(t.previewSourceFileTypes) === "string") {
                t.previewSourceFileTypes = this._stringToRegExp(t.previewSourceFileTypes)
            }
        }, _initSpecialOptions: function () {
            this._super();
            this._initFilesContainer();
            this._initTemplates();
            this._initRegExpOptions()
        }, _setOption: function (e, t) {
            this._super(e, t);
            if (e === "maxNumberOfFiles") {
                this._adjustMaxNumberOfFiles(0)
            }
        }, _create: function () {
            this._super();
            this._refreshOptionsList.push("filesContainer", "uploadTemplateId", "downloadTemplateId");
            if (!this._processingQueue) {
                this._processingQueue = e.Deferred().resolveWith(this).promise();
                this.process = function () {
                    return this._processingQueue
                }
            }
            this._resetFinishedDeferreds()
        }, enable: function () {
            var e = false;
            if (this.options.disabled) {
                e = true
            }
            this._super();
            if (e) {
                this.element.find("input, button").prop("disabled", false);
                this._enableFileInputButton()
            }
        }, disable: function () {
            if (!this.options.disabled) {
                this.element.find("input, button").prop("disabled", true);
                this._disableFileInputButton()
            }
            this._super()
        }
    })
})