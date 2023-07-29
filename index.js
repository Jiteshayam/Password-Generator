const slider = document.querySelector("[password-lengthSlider]")
const LengthDisplay = document.querySelector("[password-lengthCount]")

const passwordDisplay = document.querySelector("[data-passwordDisplay]")
const cpyMsg = document.querySelector("[data-copyMsg]")
const cpyBtn = document.querySelector("[data-Copy]")

const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");

const indicator = document.querySelector("[strength-Indicator]");
const generateBtn = document.querySelector("#GenerateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = ''
let passwordLength = 15
let checkCount = 1
passwordDisplay.value = ''


handleSlider();


//set passwordLength
function handleSlider() {
  slider.value = passwordLength;
  LengthDisplay.innerText = passwordLength;

  const min = slider.min;
  const max = slider.max;
  slider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
  return getRndInteger(0, 10);
}

function generateRandomNumber2() {
  return Math.floor(Math.random() * 10);
}

function generateLowerCase() {
  return String.fromCharCode(getRndInteger(97, 123))
}

function generateUpperCase() {
  return String.fromCharCode(getRndInteger(65, 91))
}

function generateSymbol() {
  const randNum = getRndInteger(0, symbols.length);
  return symbols.charAt(randNum);
}

function setIndicator(color) {
  indicator.style.backgroundColor = color;
  indicator.style.boxShadow = "rgba(0, 0, 0, 0.35) 0px 5px 15px";
  //shadow - HW
}

setIndicator('#ccc')

function calcStrength() {
  let hasUpper = 0;
  let hasLower = 0;
  let hasNum = 0;
  let hasSym = 0;
  if (uppercaseCheck.checked) hasUpper = 1;
  if (lowercaseCheck.checked) hasLower = 1;
  if (numbersCheck.checked) hasNum = 1;
  if (symbolsCheck.checked) hasSym = 1;

  let score = (hasUpper+hasLower+hasNum+hasSym)*passwordLength

  if (score>=100){
    setIndicator("#26374f");
  }
  else if(score>=60){
    setIndicator('#03fc41')
  }else if(score>=40){
    setIndicator('#f8fc03')
  }
  else if(score>=26){
    setIndicator('#fc9803')
  }
  else{
    setIndicator('#fc3503')
  }
  return score
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordDisplay.value);
    cpyMsg.innerText = "copied";
  }
  catch (e) {
    cpyMsg.innerText = "Failed";
  }

  cpyMsg.classList.add("active");

  setTimeout(() => {
    cpyMsg.classList.remove("active")
  }, 1000)
}

slider.addEventListener('input', (e) => {
  passwordLength = e.target.value;
  handleSlider();
})

cpyBtn.addEventListener('click', () => {
  if (passwordDisplay.value)
    copyContent();
})

function handleCheckBoxChange() {
  checkCount = 0;
  allCheckBox.forEach((checkbox) => {
    if (checkbox.checked)
      checkCount++;
  });

  //special condition
  if (passwordLength < checkCount) {
    passwordLength = checkCount;
    handleSlider();
  }
}

allCheckBox.forEach((checkbox) => {
  checkbox.addEventListener('change', handleCheckBoxChange);
})

generateBtn.addEventListener('click', () => {
  if (checkCount == 0) 
    // create a modal of selecting check box
    return;

  password = ""

  //let's put the stuff mentioned by checkboxes
  let funcArr = [];

  if (uppercaseCheck.checked)
    funcArr.push(generateUpperCase);

  if (lowercaseCheck.checked)
    funcArr.push(generateLowerCase);

  if (numbersCheck.checked)
    funcArr.push(generateRandomNumber);

  if (symbolsCheck.checked)
    funcArr.push(generateSymbol);

  //compulsory addition
  for (let i = 0; i < funcArr.length; i++) {
    password += funcArr[i]();
  }

  //remaining adddition
  for (let i = 0; i < passwordLength - funcArr.length; i++) {
    let randIndex = getRndInteger(0, funcArr.length);
    // console.log("randIndex" + randIndex);
    password += funcArr[randIndex]();
  }

  password = shufflePassword(Array.from(password));
  // console.log("Shuffling done");
  //show in UI
  passwordDisplay.value = password;
  // console.log("UI adddition done");
  //calculate strength
  calcStrength();
})

function shufflePassword(array) {
  //Fisher Yates Method
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  let str = "";
  array.forEach((el) => (str += el));
  return str;
}