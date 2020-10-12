var firebaseConfig = {
  apiKey: "AIzaSyB_Y6QJLh1F8fxiMpVf5VdgHvwwITi0dDo",
  authDomain: "cisc472-p1-e1fe1.firebaseapp.com",
  databaseURL: "https://cisc472-p1-e1fe1.firebaseio.com",
  projectId: "cisc472-p1-e1fe1",
  storageBucket: "cisc472-p1-e1fe1.appspot.com",
  messagingSenderId: "353024829045",
  appId: "1:353024829045:web:45063d7a372b15c4d97a3c"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
let gameData;
  var wordsarr = [];
  var count = 0;
  let myDB = firebase.database();
  let wordList = document.getElementById("pwords");
  var regexFilter = /[a-z]/g;
  var filler = "0";
 var correctCount = 0;

myDB.ref("starting").on("value", ss =>{
  let status = ss.val();
  if (status == 1){
    // $('button').attr("disabled", true);
  }
  
})

myDB.ref("gameData").on("value",ss =>{
  let flag = ss.val();
  if(flag != null){
    myDB.ref("gameData").child("rack").once("value", ss2 =>{
       document.getElementById("STARTERS").innerText = ss2.val();
    });
    myDB.ref("gameData").child("words").once("value", ss3 =>{
      let words = ss3.val();
      console.log(words);
      wordsarr= [];
      count = 0;
      for(word in words){
        wordsarr.push(words[word]);//Add words to wordsarr
        replacement = words[word].replace(regexFilter,filler);
        addToList(wordList,replacement);
        count++;
      }
    })
  }
})

//Fills Guess list
myDB.ref("guesses").on("value", function(snapshot){
  
   snapshot.forEach(function (openSnapshot) {
      console.log(openSnapshot.key); // The random key.
      var val = openSnapshot.val();
      console.log(val.guess);
      console.log(val.match);
     if(val.match == true){correctCount++};
     addToList(document.getElementById("guesses"),val.guess, val.match);
     
  
   });
  
  if(correctCount == count){
    myDB.ref("starting").set(0);
    document.getElementById("btn").disabled = false;
  }
});

//Clears list
$('button').click(function() {
  $('ol').empty();
  $('ul').empty();
  correctCount = 0;
  myDB.ref("guesses").set(null);
});


//Generate a new word
function generateWord(){
    myDB.ref("starting").set(1);
    myDB.ref("starting").once("value", ss3 =>{
      if(ss3.val() == 1){document.getElementById("btn").disabled = true;}
    })
    myDB.ref("dictionary").child("numstarters").once('value', ss =>{
      let rackcount = parseInt(ss.val());
      let randomrack= parseInt(Math.floor(rackcount*Math.random()));

      myDB.ref("dictionary").child("starters").child(randomrack).once('value', ss2=>{
        // document.getElementById("STARTERS").innerText = ss2.val();
        let rack = ss2.val();
        myDB.ref("dictionary").child("alphabetized").child(rack).once('value', ss3 =>{
          let words = ss3.val();
          gameData = {rack, words};
          myDB.ref("gameData").set(gameData);
        });
      });
    });
  }



function addToList(parent,input,match){
  var listElement = document.createElement("li");
  var text = document.createTextNode(input);
  listElement.appendChild(document.createTextNode(input));
  if(match == true && parent.id == "guesses") {
    listElement.style.backgroundColor = "green";
  }
  
  parent.appendChild(listElement);
}



function fillArr(){
  console.log("arr called");
}


  //Take in user input
  var inputBox = document.getElementById("guess");
  inputBox.addEventListener("keyup", function(event){
    if(event.code == "Enter"){
      var guess = document.getElementById("guess");
      // addToList(document.getElementById("guesses"),guess.value)
      $("#guesses").empty();
      console.log(checkGuess(guess.value));
      if(checkGuess(guess.value) == 1){
              myDB.ref("guesses").push({guess: guess.value, match: true});
      }else{
      myDB.ref("guesses").push({guess: guess.value, match: false});
      }
       guess.value = "";
    }
  })


function checkGuess(input){
  let value = 0;
  
  myDB.ref("gameData/words").on("value", ss =>{
    let words = ss.val();
    for(word in words){
      if(input == words[word]){
        value = 1;
      }
    }
  });
  return value;
  
}

  





