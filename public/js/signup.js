//password validation
var myInput = document.getElementById("password");

var letter = document.getElementById("letter");
var capital = document.getElementById("capital");
var number = document.getElementById("number");
var length = document.getElementById("length");
var schar = document.getElementById("schar");

// When the user clicks on the password field, show the message box
myInput.onfocus = function() {
  document.getElementById("message").style.display = "block";
}

// When the user clicks outside of the password field, hide the message box
// myInput.onblur = function() {
//   document.getElementById("message").style.display = "none";
// }

// When the user starts to type something inside the password field
myInput.onkeyup = function() {
  // Validate lowercase letters
  var lowerCaseLetters = /[a-z]/g;
  if(myInput.value.match(lowerCaseLetters)) {
    letter.classList.remove("invalid");
    letter.classList.add("valid");
  } else {
    letter.classList.remove("valid");
    letter.classList.add("invalid");
}

// Validate capital letters
var upperCaseLetters = /[A-Z]/g;
if(myInput.value.match(upperCaseLetters)) {
  capital.classList.remove("invalid");
  capital.classList.add("valid");
} else {
  capital.classList.remove("valid");
  capital.classList.add("invalid");
}

// Validate numbers
var numbers = /[0-9]/g;
if(myInput.value.match(numbers)) {
  number.classList.remove("invalid");
  number.classList.add("valid");
} else {
  number.classList.remove("valid");
  number.classList.add("invalid");
}

// Validate length
if(myInput.value.length >= 8) {
  length.classList.remove("invalid");
  length.classList.add("valid");
  } else {
    length.classList.remove("valid");
    length.classList.add("invalid");
  }

// Validate Special char
if(myInput.value.match(/[!@#$%^&*+`~'.=,*?\|\]\{\}\[\(\)\\\-<>/]/g)) {
    schar.classList.remove("invalid");
    schar.classList.add("valid");
  } else {
    schar.classList.remove("valid");
    schar.classList.add("invalid");
  }
    let message = document.getElementById("message");
    if (message.innerText === "Password must contain the following:"){
        message.style.display = "none";
    } else {
      message.style.display = "block";
    }
}

//confirm password validation
var passwdconfirm = document.getElementById("confirmpassword");
var cerror = document.getElementById("cerror");

// When the user clicks on the password field, show the message box
passwdconfirm.onfocus = function() {
  document.getElementById("cmessage").style.display = "block";
}

// When the user clicks outside of the password field, hide the message box
// passwdconfirm.onblur = function() {
//   document.getElementById("cmessage").style.display = "none";
// }

passwdconfirm.onkeyup = function() {
    if (myInput.value==passwdconfirm.value){
        cerror.classList.remove("invalid");
        cerror.classList.add("valid");
        document.getElementById("cmessage").style.display = "none";
    } else {
        cerror.classList.remove("valid");
        cerror.classList.add("invalid");
        document.getElementById("cmessage").style.display = "block";
    }
}