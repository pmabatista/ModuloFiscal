(function() {

  const config = {
      "apiKey": "AIzaSyCtDY0GEmD5fErKPwS-3ZYCi-uz_AM6v0s",
      "appId": "1:708150240191:web:21f6269ddabe871bc5b70a",
      "authDomain": "tratamentodeinfracoes.firebaseapp.com",
      "databaseURL": "https://tratamentodeinfracoes.firebaseio.com",
      "measurementId": "G-RX1LZ9MMES",
      "messagingSenderId": "708150240191",
      "projectId": "tratamentodeinfracoes",
      "storageBucket": "tratamentodeinfracoes.appspot.com"
  };

  firebase.initializeApp(config);
  const email = document.getElementById('txtEmail');
  const password = document.getElementById('txtPassword');
  const btnLogin = document.getElementById('btnLogin');

  $(document).keypress(function(e){
      if(e.which == 13) $('#btnLogin').click();
  });

  btnLogin.addEventListener('click', e => {
      const user = email.value;
      const pass = password.value;
      const auth = firebase.auth();
      const promisse = auth.signInWithEmailAndPassword(user, pass);
      promisse.catch(e => console.log(e.message));
  });

  firebase.auth().onAuthStateChanged(firebaseUser => {
      if (firebaseUser) {
          console.log(firebaseUser);
          var user = firebase.auth().currentUser.email;
          localStorage.setItem("user", user);
          window.location.href = 'index.html';
      } else {
          alert("Erro na autentificação do usuário.");
          console.log('not logged in');
      }
  });

}());