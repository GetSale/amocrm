define(['jquery', 'lib/components/base/modal'], function ($, Modal) {
    var CustomWidget = function () {
        var self = this;

        this.sendInfo = function (gs_email, gs_apikey, amo_login, amo_hash, webdomain, amodomain, widget) {
            self.crm_post(
                'https://amo.intplugins.ru/setup.php',
                {
                    email: gs_email,
                    apikey: gs_apikey,
                    amouser: amo_login,
                    authhash: amo_hash,
                    webdomain: webdomain,
                    amodomain: amodomain,
                    widgeton: widget
                },
                function (data) {
                    var error_mess = '';
                    var lang = self.i18n('userLang');

                    if (data.status == 1) {
                        modal = new Modal({
                            class_name: 'modal-window',
                            init: function ($modal_body) {
                                $modal_body
                                    .trigger('modal:loaded')
                                    .html('<h1>' + lang.congrats + '</h1><p>' + lang.success + '</p>')
                                    .trigger('modal:centrify')
                                    .append('<span class="modal-body__close"><span class="icon icon-modal-close"></span></span>');
                            },
                            destroy: function () {
                            }
                        });
                    }

                    if (data.status == 'off') {
                        modal = new Modal({
                            class_name: 'modal-window',
                            init: function ($modal_body) {
                                $modal_body
                                    .trigger('modal:loaded')
                                    .html('<h1>' + lang.widget_off + '</p>')
                                    .trigger('modal:centrify')
                                    .append('<span class="modal-body__close"><span class="icon icon-modal-close"></span></span>');
                            },
                            destroy: function () {
                            }
                        });
                    }

                    if (data.status == 'error') {
                        if (data.response) {
                            error_mess = '<h1>' + lang.error + '</h1><p>' + lang.project_not_found + '</p>';
                        }
                        if (data.code) {
                            error_mess = '<h1>' + lang.error + '</h1><p>' + lang.wrong_credentals + '</p>';

                        }

                        modal = new Modal({
                            class_name: 'modal-window',
                            init: function ($modal_body) {
                                $modal_body
                                    .trigger('modal:loaded')
                                    .html(error_mess)
                                    .trigger('modal:centrify')
                                    .append('<span class="modal-body__close"><span class="icon icon-modal-close"></span></span>');
                            },
                            destroy: function () {
                            }
                        });
                    }
                },
                'json',
                function (data) {
                    modal = new Modal({
                        class_name: 'modal-window',
                        init: function ($modal_body) {
                            $modal_body
                                .trigger('modal:loaded')
                                .html(lang.ups)
                                .html(data)
                                .trigger('modal:centrify')
                                .append('<span class="modal-body__close"><span class="icon icon-modal-close"></span></span>');
                        },
                        destroy: function () {
                        }
                    });
                }
            );
        };
        this.callbacks = {
            render: function () {
                return true;
            },
            init: function () {
                return true;
            },
            bind_actions: function () {
                return true;
            },
            settings: function () {
                return true;
            },
            onSave: function () {
                var gs_email = $('input[name="email"]').val();
                var gs_apikey = $('input[name="api_key"]').val();
                var gs_domain = $('input[name="webdomain"]').val();
                var amo_login = self.system().amouser;
                var amo_hash = self.system().amohash;
                var amo_domain = self.system().domain;
                var gs_widget = $("label[for='widget_active__sw']").hasClass('switcher__on');
                self.sendInfo(gs_email, gs_apikey, amo_login, amo_hash, gs_domain, amo_domain, gs_widget);
                return true;

            },
            destroy: function () {
            },
            contacts: {
                selected: function () {
                }
            },
            leads: {
                selected: function () {
                }
            },
            tasks: {
                selected: function () {
                }
            }
        };
        return this;
    };

    return CustomWidget;
});