const express = require('express'); 
const app = express(); 
const Cadastros = require('./Database/Cadastro')
const Disponibilidades = require('./Database/Disponibilidades')
const Escalas = require('./Database/Escalas')
const getNextWeekDates = require('./ServerModules/Functions/GetDate')
const bodyParser = require('body-parser'); 
const bcrypt = require("bcryptjs");
const session = require('express-session');
const multer = require('multer'); // Importando o Multer
const { where } = require('sequelize');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


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

app.post('/AlterInstrument', (req, res) => {
  
const id = req.session.userId
  let instrumentos = req.body.instrumentos 

 
  if (typeof instrumentos === 'string') {
    instrumentos = [instrumentos];
} else if (!Array.isArray(instrumentos)) {
    // Se instrumentos não for array (ou seja, nenhum checkbox marcado), inicializa como array vazio
    instrumentos = [];
}

  // Inicializa os valores como 'Indisponivel'
  const dados = {
      Violao: 'Indisponivel',
      Teclado: 'Indisponivel',
      Baixo: 'Indisponivel',
      Mesa: 'Indisponivel',
      Bateria: 'Indisponivel'
  };

  // Atualiza os valores para 'Disponivel' se o checkbox correspondente for marcado
  for (let i = 0; i < instrumentos.length; i++) {
    dados[instrumentos[i]] = 'Disponivel';
}

  // Atualiza o perfil existente
  Cadastros.update(dados, {
      where: { id: id }
  });
  res.redirect('/ProfilePage/' + id)
})


app.get('/ProfilePage/:id', (req, res) => {
  let id = req.params.id
Cadastros.findOne({where: {Id: id}}).then(Perfil => {
  
  res.render('ProfilePage.ejs', { Perfil: Perfil })
})

})

app.get('/Login', (req, res) => {
  res.render('LoginPage.ejs') 
})

app.get('/EnviarDisponibilidade', (req, res) => {
  // Calcula a data da proxima terça feira
const dates = getNextWeekDates();
const idlogado = req.session.userId

Cadastros.findOne({where: {Id: idlogado}}).then(Perfil => {
 
// Obtendo o nome do mês atual 
const data = new Date();
const mesAtual = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(data);
  
let dataProximaTerca = dates.nextTuesday
let dataProximaQuinta = dates.nextThursday
let dataProximoDomingo = dates.nextSunday
  res.render('SubmitAvailability.ejs', { dataProximaTerca, dataProximaQuinta, dataProximoDomingo, mesAtual, Perfil });
  
})
})

app.get('/Logout', (req, res) => {
  req.session.isLoggedIn = false; // Verificando se o Usuário Esta Logado
  req.session.token = ''; // Esvazinando o Token
  req.session.destroy(); // Destruindo a Sessão
  res.redirect('/')
})

app.post('/ChangeProfilePhoto',  upload.single('imagem'), async(req, res) => {

  const imagem = req.file.buffer; // Dados binários da imagem
  const certo = imagem.toString('base64'); // Codificando a imagem
  const IdPerfil = req.session.userId

  Cadastros.update({ FotoPerfil: certo }, {where: {Id: IdPerfil}}).then(
    res.redirect('/ProfilePage/' + IdPerfil)
  )
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