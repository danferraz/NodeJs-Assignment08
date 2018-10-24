// Get the elements in variables
var days = document.getElementById("workingDayInput");


function calculatePenny() {
    
    let isValid = true;
    if (!(days.value > 0) && !(days.value < maximumDays)) {
        isValid = false;
    }
    return isValid;
}

function IsNumeric(event) {
    var charCode = (event.which) ? event.which : event.keyCode
    if ((charCode < ASCIIZero || charCode > ASCIINine)) {
        return false;
    } else {
        return true;
    }
}

function reset() {
    window.location.reload();
}
