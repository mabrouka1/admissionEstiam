var express = require('express');
var router = express.Router();

/* GET users Home. */
router.get('/', function(req, res, next) {
    res.render('users/index', { dashboard:'active' ,title: 'Admission Estiam - Espace Admission'});
});


/* GET users Home. */
router.get('/candidacy', function(req, res, next) {
    res.render('users/candidacy', {admission: 'active', candidacy: 'active',title: 'Admission Estiam - Candidature'});
});


module.exports = router;
