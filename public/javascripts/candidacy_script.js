'use strict;'
$(function () {

    $.datetimepicker.setLocale('fr');
    $('.date').datetimepicker({timepicker:false,format:'d/m/Y',});
    $(".country").countrySelect({preferredCountries: ['fr', 'gb', 'sn']});
    var wizard = $('.wizard').wizard({
        templates: {
            buttons: function() {
                const options = this.options;
                return '<ul class="pagination pagination-lg">' +
                            '<li><a class="wizard-back" href="#'+this.id+'" data-wizard="back" role="button">'+ options.buttonLabels.back+'</a></li>' +
                            '<li><a class="wizard-next" href="#'+this.id+'" data-wizard="next" role="button">'+ options.buttonLabels.next+'</a></li>' +
                            '<li><a class="wizard-finish" href="#'+this.id+'" data-wizard="finish" role="button">'+ options.buttonLabels.finish+'</a></li>' +
                        '</ul>';
            }
        },
        buttonLabels: {
            next: 'Suivant',
            back: 'Retour',
            finish: 'Terminer'
        },
        validator: function(step) {
            return true;
        },
        onNext: function(step){handleNext(step)}
    });

    $.validate({
        lang: 'fr',
        modules : 'date, security'
    });

    var handleNext = function (e) {
        var pane = e.$pane;
        switch ($(pane).data('title')){
            case 'info':
                console.log();
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
