'use strict;'
$(function () {

    $.datetimepicker.setLocale('fr');
    $('.date').datetimepicker({timepicker: false, format: 'd-m-Y',});
    $(".country").countrySelect({preferredCountries: ['fr', 'gb', 'sn']});
    var wizard = $('.wizard').wizard({
        enableWhenVisited: true,
        templates: {
            buttons: function () {
                const options = this.options;
                return '<ul class="pagination pagination-lg">' +
                    '<li><a class="wizard-back" href="#' + this.id + '" data-wizard="back" role="button">' + options.buttonLabels.back + '</a></li>' +
                    '<li><a class="wizard-next" href="#' + this.id + '" data-wizard="next" role="button">' + options.buttonLabels.next + '</a></li>' +
                    '<li><a class="wizard-finish" href="#' + this.id + '" data-wizard="finish" role="button">' + options.buttonLabels.finish + '</a></li>' +
                    '</ul>';
            }
        },
        buttonLabels: {
            next: 'Suivant',
            back: 'Retour',
            finish: 'Soumettre'
        },

        onFinish: function () {
            console.log(step);
            return false;
            //handleFinish(step)
        },
        onReady: function (e) {
            var wizard = this, steps = wizard.steps;
            $.each(steps, function (i, e) {
                e.states.disabled = false;
            });
            $(".wizard-steps li.active").siblings().removeClass("disabled");
        }
    });

    $.validate({
        lang: 'fr',
        modules: 'date, security'
    });

    var annee_scolaire = new ConditionalField({
        control: '.annee_scolaire',
        visibility: {
            'Autres': '.last_precisez',
        }
    });

    var previous_school = new ConditionalField({
        control: '[name="previous\[school\]"]',
        visibility: {
            'different': '.previous_school'
        }
    });


    $('.save-form').click(function (e) {
        e.preventDefault();
        var current_pane = $('#wizard').find('.wizard-content > .active');
        handleSave(current_pane);
        return false;
        //handleNext(step);
    });

    $("div.drop-zone").dropzone(
        {
            url: "/users/candidacy/upload",
            uploadMultiple: false,
            autoDiscover: false,
            acceptedFiles: "image/jpeg,image/png,application/pdf",
            init: function () {
                var notify, progress = $(this.element).data("input");
                this.on("addedfile",
                    function (file) {
                        $(`.${progress}.progress-bar`).addClass("progress-bar-striped");
                        notify = $.notify(
                            {
                                icon: 'glyphicon glyphicon-exclamation-sign',
                                message: '<strong>Envoie en cours</strong> Ne fermez pas cette page ...',
                            }, {
                                allow_dismiss: false
                            }
                        );
                    }
                );
                this.on("success",
                    function (message) {
                        var resp = JSON.parse(message.xhr.response);
                        var file = resp.message;
                        $(`input[name='${progress}']`).val(JSON.stringify(file));
                        $(`.${progress}:not('.progress-bar') `).html(file.originalname);
                        $(`.${progress}.progress-bar`).removeClass("progress-bar-striped").addClass("progress-bar-success");
                        notify.update({type: 'success', message: '<strong>Envoie Réussie</strong> '});
                    }
                );
                this.on("error",
                    function () {
                        $(`.${progress}.progress-bar`).removeClass("progress-bar-striped").addClass("progress-bar-danger");
                        notify.update({type: 'danger', message: '<strong>Echec de l\'Envoie </strong> Réessayer ...'});
                    }
                );
                this.on("complete",
                    function (response) {
                        console.log(response);
                    }
                );

            }
        }
    );
    var handleSave = function (e) {
        var form = $(e).find('form');
        var title = $(e).data('title');
        form.trigger('validation');
        var isValid = form.isValid();
        if (isValid) {
            var data = $(form).serializeJSON();
            var notify = $.notify(
                {
                    icon: 'glyphicon glyphicon-exclamation-sign',
                    message: '<strong>Envoie en cours</strong> Ne fermez pas cette page ...',
                },
                {
                    allow_dismiss: false,
                    showProgressbar: true
                });
            $.post('/users/candidacy', data)
                .done(function (response) {
                    console.log(response);
                    notify.update({type: 'success', message: '<strong>Envoie Réussie</strong>'});
                })
                .fail(function (response) {
                    console.log(response);
                    notify.update({type: 'danger', message: '<strong>Echec de l\'Envoie </strong> Réessayer ...'});
                });
        }
    };


    var handleNext = function (e) {
        var pane = e.$pane;
        switch ($(pane).data('title')) {
            case 'info':
                form.trigger('submit.validation');
                console.log(form.isValid());
                break;
            case 'father':
                console.log();
                break;
            case 'mother':
                console.log();
                break;
            case 'tutor':
                console.log();
                break;
            case 'cursus':
                console.log();
                break;
            case 'files':
                console.log();
                break;
            case 'wish':
                console.log();
                break;
            default:
                console.log();
                break;
        }
    }

})
;

$.fn.extend({
    serializeJSON: function (exclude) {
        exclude || (exclude = []);
        return this.serializeArray().reduce(function (hash, pair) {
            pair.value && !(pair.name in exclude) && (hash[pair.name] = pair.value);
            return hash;
        }, {});
    }
});
