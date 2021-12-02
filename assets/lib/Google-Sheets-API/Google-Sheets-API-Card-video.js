let urlDatos= "";
let JsonDatWeb=[];
let arrayColunm=[];
let arraySecondColunm=[];
let arrayThirdColunm=[];
let arrayfourthColunm=[];
let palabraElegida="";
let keyPalabraElegida=0;

//paginas permitidas para la busqueda

//paginas permitidas para la busqueda

const textFront = document.getElementById("text-front");
const textBack= document.getElementById("text-back");
const audioSource= document.getElementById("audioSource");
const imageGen= document.getElementById("imageGen");
const videoGen= document.getElementById("videoSource");
const randomWord = document.getElementById("randomWord");
const btnNext = document.getElementById("btnNext");
const btnPrev = document.getElementById("btnPrev");
const btnFlip = document.getElementById("buttonFlip");



function initGoogleSheetApi(tabName,apiKey,idFile) {
  urlDatos= `https://sheets.googleapis.com/v4/spreadsheets/${idFile}/values/${tabName}?alt=json&key=${apiKey}`;

  randomWord.addEventListener("click", function() {
    selectRandomWord();
  });
  
  btnNext.addEventListener("click", function() {
    nextWord();
  });
  btnPrev.addEventListener("click", function() {
    prevWord();
  });
  
  fetch(urlDatos)
    .then(res => res.json())
    .then((out) => {
      JsonDatWeb = out.values;
      console.info(JsonDatWeb);

      arrayColunm = selectColumn(JsonDatWeb, 0);
      arraySecondColunm = selectColumn(JsonDatWeb, 1);
      arrayThirdColunm = selectColumn(JsonDatWeb, 2);
      arrayfourthColunm = selectColumn(JsonDatWeb, 3);
      addTextInCard();
      findImage();
      showNumbersInbutton();

      createDataListForSeach();
    })
    .catch(err => { throw err });
}


function addRowGoogleSheetApi(tabName,apiKey,idFile) 
{
  var params = {
    "range": "Sheet1!A1:B1",
    "majorDimension": "ROWS",
    "values": [
      ["Hello", "World"]
    ],
  }

  var xhr = new XMLHttpRequest();
  xhr.open('PUT', `https://sheets.googleapis.com/v4/spreadsheets/${idFile}/values/${tabName}!A1:B1?valueInputOption==USER_ENTERED;headers=false&key=${apiKey}`);

  xhr.setRequestHeader('Authorization', apiKey);
  xhr.send(JSON.stringify(params));
}


function selectColumn(array, column)
{
  let countArray=array.length;
  let arrayColumnSelect=[];
  for(let i=0;i<countArray;i++)
  {
    arrayColumnSelect.push(array[i][column]);
  }
  return arrayColumnSelect;
}
function addTextInCard()
{
  palabraElegida=arrayColunm[keyPalabraElegida];
  textFront.innerHTML=palabraElegida;
}

function soundCard() {

  let segundaImagen = findIfExistText2(arrayfourthColunm);

  let newSound= findIfExistText2(arrayColunm);
  if (newSound!="") {
    newSound = (newSound).replace(" ", "+");
    let urlAudio = "https://audio1.spanishdict.com/audio?lang=en&text=" + newSound;
    audioSource.src = urlAudio;
    /*if(segundaImagen.trim() != "" && checkURL(segundaImagen) )
    {
      audioSource.play();
    } */
    audioSource.play();   
  }
}
function playAudioAgain()
{
  audioSource.play();
}

function playCard(){
  audioSource.play();
}

function findImage() {

  let wordSelect = findIfExistText2(arraySecondColunm);
  let segundaImagen = findIfExistText2(arrayfourthColunm);
  //let imagenSelect = arrayfourthColunm[keyPalabraElegida];
  videoGen.style.display = "none";
  imageGen.style.display = "none";


  setTimeout(() => {
    textBack.innerHTML = findIfExistText();
    if (segundaImagen.trim() == "") {
      imageGen.style.display = "block";
      urlTenor = `https://api.tenor.com/v1/search?q=${wordSelect}&key=50VSNFV0FFT1`;
      fetch(urlTenor)
        .then(res => res.json())
        .then((out) => {
          console.info(out.results);
          //console.info(out.results[0].media[0].tinygif.url);
          let cantResults = out.results.length;
          let imageRandom = parseInt(Math.random() * cantResults);
          let imagenEncontrada = out.results[imageRandom].media[0].tinygif.url;
          //let tituloEncontrado=out.items[imageRandom].htmlTitle;
          imageGen.src = imagenEncontrada;
        })
    } else {
      let isImage = checkURL(segundaImagen);
      if (isImage) {
        imageGen.src = segundaImagen;
        imageGen.style.display = "block";
        videoGen.style.display = "none";

      } else if (checkIfIsVideo(segundaImagen)) {

        let str = segundaImagen;
        myvids = str.split(",");
        if (myvids.length > 1) {
          videoGen.src = myvids[0];
          videoGen.style.display = "block";
          imageGen.style.display = "none";
        }
        else {
          videoGen.src = segundaImagen;
          videoGen.style.display = "block";
          imageGen.style.display = "none";
        }

      } else {


        videoGen.src = `https://drive.google.com/uc?export=view&id=${segundaImagen}`;
        videoGen.style.display = "block";
        imageGen.style.display = "none";
      }

    }
  }, 500);

}

function selectRandomWord()
{
  let cantidadPalabras=arrayColunm.length - 1;
  let newWordKey=parseInt(Math.random()*cantidadPalabras);
  showInCard(newWordKey);
}

function showInCard(id)
{
  keyPalabraElegida=id;
  flipCardRestart();
  addTextInCard();
  findImage();
  showNumbersInbutton();
}


function nextWord()
{
  let cantidadPalabras=arrayColunm.length - 1;
  if(keyPalabraElegida==cantidadPalabras)
  {
    keyPalabraElegida=0;
  }else{
    keyPalabraElegida++;
  }

  flipCardRestart();
  addTextInCard();
  findImage();
  showNumbersInbutton();
}

function prevWord()
{
  let cantidadPalabras=arrayColunm.length - 1;
  if(keyPalabraElegida==0)
  {
    keyPalabraElegida=cantidadPalabras;
  }else{
    keyPalabraElegida--;
  }

  flipCardRestart();
  addTextInCard();
  findImage();
  showNumbersInbutton();
}

function findIfExistText()
{
  let finalWord="";
  finalWord=arraySecondColunm[keyPalabraElegida];
  return finalWord;
}

function findIfExistText2(array)
{
  let finalWord="";
  finalWord=array[keyPalabraElegida];
  return finalWord;
}

function showNumbersInbutton()
{
  btnFlip.innerHTML="FLIP  - " + (keyPalabraElegida + 1) + " / " + arrayColunm.length;
}

function checkURL(url) {
  return(url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

function checkIfIsVideo(url) {
  return(url.match(/\.(mp4|webm)$/) != null);
}

function wait(ms){
  var start = new Date().getTime();
  var end = start;
  while(end < start + ms) {
    end = new Date().getTime();
 }
}


var myvids = [];
var activeVideo = 0;

videoGen.addEventListener('ended', function (e) {
  if (myvids.length > 1) {
    // update the new active video index
    activeVideo = (++activeVideo) % myvids.length;

    // update the video source and play
    videoGen.src = myvids[activeVideo];
    videoGen.play();
  }

});



function createDataListForSeach()
{
  let datalist = document.getElementById("listText");
  let tempList = "";
  if(datalist!=undefined)
  {
    for(let i=0; i<arrayColunm.length; i++)
    {
      tempList += `<option>${arrayColunm[(arrayColunm.length-1)-i]}</option>`;
    }
    
  }
  datalist.innerHTML = tempList;
}

function showInCardTextTyped()
{
  let textToSearch = document.getElementById("textTyped").value;
  if(textToSearch.trim()=="")
  {
    return;
  }
  let id = searchInList(textToSearch);
  if(id!=undefined)
  {
    showInCard(id);
    console.log(`showInCard(${id})`);
  }
}


function searchInList(textToSearch)
{
  let id = -1;
    for(let i=0; i<arrayColunm.length; i++)
    {
      if(textToSearch == arrayColunm[i])
      {
        id=i;
      }
    }
    if(id!=-1)
    {
      return id;
    }
    else
    {
      alert("text not found");
    }
}