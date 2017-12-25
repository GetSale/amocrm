define(['jquery', 'lib/components/base/modal'], function ($, Modal) {
    var CustomWidget = function () {
        var self = this;

        this.sendInfo = function (gs_email, gs_apikey, amo_login, amo_hash, webdomain, amodomain, is_active) {
            self.crm_post(
                'https://amo.intplugins.ru/setup.php',
                {
                    email: gs_email,
                    apikey: gs_apikey,
                    amouser: amo_login,
                    authhash: amo_hash,
                    webdomain: webdomain,
                    amodomain: amodomain,
                    aferta: is_active
                },
                function (data) {
                    var error_mess = '';
                    var lang = self.i18n('userLang');

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
                                var $this = $(this);
                                $modal_body
                                    .trigger('modal:loaded')
                                    .html(error_mess)
                                    .trigger('modal:centrify')
                                    .append('<span class="modal-body__close"><span class="icon icon-modal-close"></span></span>');
                            },
                            destroy: function () {
                            }
                        });
                        return true;
                    }

                    if (data.status == '1') {
                        modal = new Modal({
                            class_name: 'modal-window',
                            init: function ($modal_body) {
                                var $this = $(this);
                                $modal_body
                                    .trigger('modal:loaded')
                                    .html('<h1>' + lang.congrats + '</h1><p>' + lang.success + '</p>')
                                    .trigger('modal:centrify')
                                    .append('<span class="modal-body__close"><span class="icon icon-modal-close"></span></span>');
                            },
                            destroy: function () {
                            }
                        });
                        return true;
                    }
                    if (data.status == 'aferta') {
                        modal = new Modal({
                            class_name: 'modal-window',
                            init: function ($modal_body) {
                                var $this = $(this);
                                $modal_body
                                    .trigger('modal:loaded')
                                    .html(lang.gs_check_error)
                                    .trigger('modal:centrify')
                                    .append('<span class="modal-body__close"><span class="icon icon-modal-close"></span></span>');
                            },
                            destroy: function () {
                            }
                        });
                        return true;
                    }
                },
                'json',
                function (data) {
                    modal = new Modal({
                        class_name: 'modal-window',
                        init: function ($modal_body) {
                            var $this = $(this);
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
                    return true;
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
                $(".widget_settings_block").find("input[name='data_transfer']")
                    .attr("type", "checkbox")
                    .change(function () {
                        $(this).val($(this).prop("checked") ? '1' : '');
                    }).parent().css("width", 100);
                var agreement = $(".widget_settings_block").find("input[name='data_transfer']");
                if (self.get_settings().atc_token) {
                    agreement.prop("checked", true);
                }
                return true;
            },
            onSave: function () {
                var gs_email = $('input[name="email"]').val();
                var gs_apikey = $('input[name="api_key"]').val();
                var gs_domain = $('input[name="webdomain"]').val();
                var amo_login = self.system().amouser;
                var amo_hash = self.system().amohash;
                var amo_domain = self.system().domain;
                var is_active = $(".widget_settings_block").find("input[name='widget_active']").is(':checked');
                if (is_active) {
                    self.sendInfo(gs_email, gs_apikey, amo_login, amo_hash, gs_domain, amo_domain, is_active);
                }
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
        }
        ;
        return this;
    };

    return CustomWidget;
});