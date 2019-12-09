const app = require('express')();
const { extract } = require('article-parser');
const htmlToText = require('html-to-text');

app.get('/', (req, res) => res.send({ status: 'online' }));

app.get('/crawler', (req, res) => {
  console.log('rota -> crawler');

  const urls = [
    'https://g1.globo.com/mundo/noticia/2019/12/09/erupcao-na-nova-zelandia-apos-sobrevoos-policia-diz-que-nao-ha-sinal-de-vida-em-vulcao.ghtml',
    'https://globoesporte.globo.com/olimpiadas/noticia/agencia-mundial-antidoping-exclui-a-russia-dos-jogos-olimpicos-durante-quatro-anos.ghtml',
  ];

  const promises = urls.map(url => extract(url));

  Promise.all(promises).then(values => {
    const result = values.map(value => {
      return {
        title: value.title,
        url: value.url,
        text: htmlToText.fromString(value.content)
      };
    });

    res.send({ result });
  }).catch(error => res.send({ error }));
});

app.listen(3000, () => console.log('Servidor escutando na porta 3000...'));