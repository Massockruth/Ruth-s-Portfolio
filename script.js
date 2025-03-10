
function toggleMode() {
    var element = document.body;
	const body = document.body;
	const icon = document.getElementById('toggle-icon');
	const text = document.getElementById('toggle-text');
	body.classList.toggle('dark-mode');
	body.classList.toggle('light-mode');
	if (body.classList.contains('dark-mode')) {
        element.classList.toggle("light-mode"); 
		icon.src = 'dark.png';

	} else {

		icon.src = 'light.png';

	
	}
}

function clearDisplay() {
    document.getElementById('display').value = '';
}

function deleteLast() {
    let display = document.getElementById('display');
    display.value = display.value.slice(0, -1);
}

function appendNumber(number) {
    let display = document.getElementById('display');
    display.value += number;
}

function appendOperator(operator) {
    let display = document.getElementById('display');
    if (display.value === '' && operator === '-') {
        display.value += operator;  // Allow negative numbers
    } else if (display.value !== '') {
        display.value += operator;
    }
}

function calculateResult() {
    let display = document.getElementById('display');
    try {
        display.value = eval(display.value);
    } catch (error) {
        display.value = 'Error';
    }
}
