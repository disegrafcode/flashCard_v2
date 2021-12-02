let urlDatos= ``;
let JsonDatWeb=[];
let arrayColunm=[];
let arraySecondColunm=[];
let palabraElegida="";
let keyPalabraElegida=0;

//paginas permitidas para la busqueda

//paginas permitidas para la busqueda

const textFront = document.getElementById("text-front");
const textBack= document.getElementById("text-back");
const audioSource= document.getElementById("audioSource");
const imageGen= document.getElementById("imageGen");
const randomWord = document.getElementById("randomWord");
const btnNext = document.getElementById("btnNext");
const btnPrev = document.getElementById("btnPrev");
const btnFlip = document.getElementById("buttonFlip");

function initGoogleSheetApi(tabName,apiKey,idFile)
{  
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
    JsonDatWeb=out.values;
    /*console.log(JsonDatWeb[0][0]);*/
    arrayColunm=selectColumn(JsonDatWeb, 0);
    arraySecondColunm=selectColumn(JsonDatWeb, 1);
    addTextInCard();
    findImage();
    showNumbersInbutton();
    createDataListForSeach();
  })
  .catch(err => { throw err });
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

function soundCard()
{
  let palabraParaAudio=palabraElegida.replace(" ", "+");
  let urlAudio="https://audio1.spanishdict.com/audio?lang=en&text="+palabraParaAudio;
  audioSource.src = urlAudio;
  audioSource.play();
}



function findImage()
{
  urlTenor=`https://api.tenor.com/v1/search?q=${palabraElegida}&key=50VSNFV0FFT1`;
  fetch(urlTenor)
  .then(res => res.json())
  .then((out) => {
    /*console.info(out.results);*/
    //console.info(out.results[0].media[0].tinygif.url);
    let cantResults=out.results.length;
    let imageRandom=parseInt(Math.random()*cantResults);
    let imagenEncontrada=out.results[imageRandom].media[0].tinygif.url;
    //let tituloEncontrado=out.items[imageRandom].htmlTitle;
    imageGen.src=imagenEncontrada;

    textBack.innerHTML=findIfExistText();
  })
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
}

function findIfExistText()
{
  let finalWord="";
  finalWord=arraySecondColunm[keyPalabraElegida];
  return finalWord;
}

function showNumbersInbutton()
{
  btnFlip.innerHTML="FLIP  - " + (keyPalabraElegida + 1) + " / " + arrayColunm.length;
}

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