export function renderTemplate(res, tmpl, data) {
    res.render(tmpl, data, (err, html) => {
        if (err) {
            console.error('Erreur lors du rendu de la template', err);
            res.status(500).send('Erreur interne du serveur');
            return;
        }
        res.send(html);
    });
}