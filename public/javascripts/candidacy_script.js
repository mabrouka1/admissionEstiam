'use strict;'
$(function () {

    $.datetimepicker.setLocale('fr');
    $('.date').datetimepicker({timepicker: false, format: 'd-m-Y',});
    $(".country").countrySelect({preferredCountries: ['fr', 'gb', 'sn']});
    var wizard = $('.wizard').wizard({
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
            finish: 'Terminer'
        },
        validator: function (step) {
            return true;
        },
        onNext: function (step) {
            //handleNext(step)
        }
    });

    $.validate({
        lang: 'fr',
        modules: 'date, security'
    });

    $('.save-form').click(function (e) {
        e.preventDefault();
        var current_pane = $('#wizard').find('.wizard-content > .active');
        handleSave(current_pane);
        return false;
        //handleNext(step);
    });

    var handleSave = function (e) {
        var form = $(e).find('form');
        var title = $(e).data('title');
        form.trigger('validation');
        var isValid = form.isValid();
        if (isValid) {
            var data = $(form).serializeJSON();
            $.post('/users/candidacy', data)
                .done(function (response) {
                    console.log(response);
                })
                .fail(function (response) {
                    console.log(response);
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

});

$.fn.extend({
    serializeJSON: function(exclude) {
        exclude || (exclude = []);
        return this.serializeArray().reduce(function(hash, pair) {
            pair.value && !(pair.name in exclude) && (hash[pair.name] = pair.value);
            return hash;
        }, {});
    }
});