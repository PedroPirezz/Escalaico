const express = require('express'); 
const app = express(); 
const Cadastros = require('./Database/Cadastro')
const Disponibilidades = require('./Database/Disponibilidades')
const Escalas = require('./Database/Escalas')
const bodyParser = require('body-parser'); 
const bcrypt = require("bcryptjs");
const session = require('express-session');


const sessionConfig = session({
  secret: 'Cuidadoso', // Chave secreta para assinar os cookies de sessão
  resave: false, // Salva a sessão apenas se modificada
  saveUninitialized: true, // Salva a sessão mesmo que não inicializada
  cookie: {
      expires: false // Cookie expira quando o navegador é fechado
  }
});
const localVariables = (req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn || false;
  res.locals.userName = req.session.userName || null;
  res.locals.userId = req.session.userId || null;
  res.locals.token = req.session.token || null;
  res.locals.TipoConta = req.session.TipoConta;
  next();
};
app.use(sessionConfig);
app.use(localVariables);





app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));



app.get('/', (req, res) => {
  res.render('Home.ejs')
})

app.get('/Login', (req, res) => {
  res.render('LoginPage.ejs')
})

app.get('/EnviarDisponibilidade', (req, res) => {
  // Calcula a data da proxima terça feira
  const dataHoje = new Date();
  const proximaTerca = new Date(dataHoje.getTime() + (2 - dataHoje.getDay() + 7) * 24 * 60 * 60 * 1000);
  const diaProximaTerca = ('0' + proximaTerca.getDate()).slice(-2);
  const mesProximaTerca = ('0' + (proximaTerca.getMonth() + 1)).slice(-2);
  const anoProximaTerca = proximaTerca.getFullYear();
  const dataProximaTerca = `${diaProximaTerca}/${mesProximaTerca}/${anoProximaTerca}`;
  


  // Calcula a data da proxima quinta feira
  const proximaQuinta = new Date(dataHoje.getTime() + (4 - dataHoje.getDay() + 7) * 24 * 60 * 60 * 1000);
  const diaProximaQuinta = ('0' + proximaQuinta.getDate()).slice(-2);
  const mesProximaQuinta = ('0' + (proximaQuinta.getMonth() + 1)).slice(-2);
  const anoProximaQuinta = proximaQuinta.getFullYear();
  const dataProximaQuinta = `${diaProximaQuinta}/${mesProximaQuinta}/${anoProximaQuinta}`;
  

  // Calcula a data do proximo domingo
  const proximoDomingo = new Date(dataHoje.getTime() + (0 - dataHoje.getDay() + 7) * 24 * 60 * 60 * 1000);
  const diaProximoDomingo = ('0' + proximoDomingo.getDate()).slice(-2);
  const mesProximoDomingo = ('0' + (proximoDomingo.getMonth() + 1)).slice(-2);
  const anoProximoDomingo = proximoDomingo.getFullYear();
  const dataProximoDomingo = `${diaProximoDomingo}/${mesProximoDomingo}/${anoProximoDomingo}`;

  res.render('SubmitAvailability.ejs', { dataProximaTerca, dataProximaQuinta, dataProximoDomingo });
  

})

app.get('/Logout', (req, res) => {
  req.session.isLoggedIn = false; // Verificando se o Usuário Esta Logado
  req.session.token = ''; // Esvazinando o Token
  req.session.destroy(); // Destruindo a Sessão
  res.redirect('/')
})


app.post('/LoginAuthentication', (req, res) => {

  console.log("ta entrando aqui")
  
  let email = req.body.pinto
  let senha = req.body.senha
  const salt = bcrypt.genSaltSync(10); // Definindo a configuração do algoritmo de criptografia



  Cadastros.findOne({ where: { Email: email } }).then(cadastros => {
    
      if (cadastros) { // Caso o usuário exista

          let testelogin = bcrypt.compareSync(senha, cadastros.Senha); // Verificando se a senha esta correta

          if (cadastros && testelogin == true) { // Caso a senha esteja correta


              let token = bcrypt.hashSync(email, salt); // Gerando um token baseado no email


              cadastros.update({ Token: token }); // Atualizando o token

              req.session.isLoggedIn = true; //Guardando na sessão que o usuário está logado
              req.session.userName = cadastros.Nome; // Guardando na sessão o nome do usuário
              req.session.userId = cadastros.id; // Guardando na sessão o ID do usuário
              req.session.token = cadastros.Token; // Guardando na sessão o Token do usuário
              req.session.TipoConta = cadastros.TipoConta; // Guardando na sessão o Tipo de Conta do usuário

              res.redirect('/');

          }
          else { //Se a senha estiver errada
              Status = "Email ou Senha Incorretos";
              res.render('LoginPage.ejs');
          }
      } else { //Se o usuário não existir
          Status = "Usuario não cadastrado";
          res.render('LoginPage.ejs');
      }
  })

})


app.listen(80, function() {
  console.log('Initiated')
})