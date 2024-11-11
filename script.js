// Turing Machine class
class TuringMachine {
    constructor(tape, startState, finalStates, transitionFunction) {
        this.tape = tape.split("");  // Convert input string to an array
        this.head = 0;               // Initial tape head position
        this.state = startState;     // Initial state of the machine
        this.finalStates = finalStates;  // Set of accepting states
        this.transitionFunction = transitionFunction;  // The transition function
    }

    // Executes a single step
    step() {
        const currentSymbol = this.tape[this.head] || ' ';  // Current symbol under the head

        // Check if a transition exists for this state and symbol
        if (this.transitionFunction.hasOwnProperty(`${this.state},${currentSymbol}`)) {
            const [newState, newSymbol, moveDirection] = this.transitionFunction[`${this.state},${currentSymbol}`];

            // Update tape symbol
            this.tape[this.head] = newSymbol;

            // Move the head ('L' = left, 'R' = right)
            if (moveDirection === 'L') {
                this.head--;
            } else if (moveDirection === 'R') {
                this.head++;
            }

            // Update the current state
            this.state = newState;
        } else {
            // If no valid transition, halt the machine
            this.state = null;
        }
    }

    // Runs the machine until it halts
    run() {
        while (this.state && !this.finalStates.has(this.state)) {
            this.step();
        }
    }

    // Returns the tape as a string
    getTape() {
        return this.tape.join('');
    }

    // Returns the current position of the head
    getHeadPosition() {
        return this.head;
    }

    // Returns the current state of the machine
    getCurrentState() {
        return this.state;
    }
}

// Define the transition function (state, symbol) -> [new_state, new_symbol, move_direction]
const transitionFunction = {
    'q0,0': ['q1', 'X', 'R'],
    'q0,1': ['q2', 'Y', 'R'],
    'q1,0': ['q1', '0', 'R'],
    'q1,1': ['q3', 'Y', 'L'],
    'q1,Y': ['q1', 'Y', 'R'],
    'q2,1': ['q2', '1', 'R'],
    'q2,0': ['q3', 'X', 'L'],
    'q2,Y': ['q2', 'Y', 'R'],
    'q3,0': ['q3', '0', 'L'],
    'q3,1': ['q3', '1', 'L'],
    'q3,X': ['q0', 'X', 'R'],
    'q3,Y': ['q0', 'Y', 'R'],
};

const startState = 'q0';
const finalStates = new Set(['q0', 'q1', 'q2']);  // Accepting states

// Function to process the input and run the Turing machine
function runTuringMachine() {
    const inputString = document.getElementById("binaryInput").value.trim();
    const resultArea = document.getElementById("resultArea");
    const debugArea = document.getElementById("debugArea");

    // Validate the input to ensure it's binary
    if (!/^[01]+$/.test(inputString)) {
        resultArea.textContent = "Error: Input must only contain '1's and '0's.";
        debugArea.textContent = "";
        return;
    }

    // Create a Turing machine instance
    const tm = new TuringMachine(inputString, startState, finalStates, transitionFunction);

    // Run the Turing machine
    tm.run();

    // Output the final tape, state, and head position
    resultArea.innerHTML = `
        <strong>Final Tape:</strong> ${tm.getTape()}<br>
        <strong>Final State:</strong> ${tm.getCurrentState()}<br>
        <strong>Head Position:</strong> ${tm.getHeadPosition()}
    `;

    // Debug information
    debugArea.innerHTML = `
        <strong>Debugging Output:</strong><br>
        <strong>Input Tape:</strong> ${inputString}<br>
        <strong>Transition Function:</strong> Running...
    `;

    // Check if the machine is in an accepting state
    if (finalStates.has(tm.getCurrentState())) {
        resultArea.innerHTML += "<br><strong>Result:</strong> Input string is accepted.";
    } else {
        resultArea.innerHTML += "<br><strong>Result:</strong> Input string is rejected.";
    }
}
