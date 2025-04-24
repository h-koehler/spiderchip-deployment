const levels: PuzzleDefinition[] = [
    {
        puzzle_number: 1,
        title: 'Data Pipe',
        description: 'The data pipe is one of the fundamental systems that allows modules to communicate with each other. Whatever goes in, must come out.',
        data: {
            hints: ["First, read the input by typing 'x = input()' on the first line.", "Next, output what you just read using 'output(x)' on the second line."],
            objects: {},
            overview: "Implement the data pipe by reading all inputs and writing them to outputs.\nPrograms automatically restart from the top when they reach the bottom.\n\nYou can use the input() function to read inputs.\nIt \"returns\" the value from input, which you can store by setting a variable to it, like so: x = input().\nYou can use the output() function to write an output.\noutput() takes a single \"argument\" - put it in the parentheses, like so: output(x).",
            slot_count: 3,
            slot_names: ["x", null, null],
            test_cases: [{
                input: [5, 2, 7, 1, 5, 1, 8, 9, 5, 5],
                output: [5, 2, 7, 1, 5, 1, 8, 9, 5, 5]
            }, {
                input: [1, 0, -1, 6, 12, -10, 2],
                output: [1, 0, -1, 6, 12, -10, 2]
            }, {
                input: [9, 2, 6, 3, 6, 2, 1],
                output: [9, 2, 6, 3, 6, 2, 1]
            }],
            bonus_line_count: 1,
            target_line_count: 2
        }
    },
    {
        puzzle_number: 2,
        title: 'Swapper',
        description: 'The swapper exchanges the each pair of values that are given to it.',
        data: {
            hints: ["It's easiest to read both values before trying to output either of them.", "Use two variables - read the first input into x, then the second into y.", "If you read the first input into x, then you should output(y) first."],
            objects: {},
            overview: "For each pair of inputs given, output them in the opposite order.\nThere will always be an even number of inputs.\n\nRemember:\ninput() reads a value from input.\noutput(x) writes a value to output.\nAssign a value with x = value.",
            slot_count: 3,
            slot_names: ["x", "y", null],
            test_cases: [{
                input: [5, 2, 7, 1, 5, 1, 8, 9],
                output: [2, 5, 1, 7, 1, 5, 9, 8]
            }, {
                input: [1, 0, -1, 6, -10, -10, 0, 1],
                output: [0, 1, 6, -1, -10, -10, 1, 0]
            }, {
                input: [1, 6],
                output: [6, 1]
            }],
            bonus_line_count: 3,
            target_line_count: 4
        }
    },
    {
        puzzle_number: 3,
        title: 'Pair Sum',
        description: 'Summation is one of the basic operations for a computer.',
        data: {
            hints: ["You can look at your swapper code to remember how to read both inputs.", "Add two variables using x + y. Store the result in either of these two.", "x = x + y will add x and y and store the result in x."],
            objects: {},
            overview: "For each pair of inputs, output their sum.\n\nWrite equations similarly to by-hand. For example, x = 2 * 3 will assign x to the value 6.",
            slot_count: 3,
            slot_names: ["x", "y", null],
            test_cases: [{
                input: [1, 2, 4, 1, 0, 2, -1, 2],
                output: [3, 5, 2, 1]
            }, {
                input: [-5, 5, 8, 15, 2, 9],
                output: [0, 23, 11]
            }, {
                input: [6, 1],
                output: [7]
            }],
            bonus_line_count: 1,
            target_line_count: 4
        }
    },
    {
        puzzle_number: 4,
        title: 'Pipe Filter',
        description: 'Sometimes bad data gets into the system. This module helps filter it out while working like a pipe.',
        data: {
            hints: ["Your code from the data pipe is probably pretty close, it just needs an if statement.", "Check if a value is less than 10 using the less than operator, x < 10.", "Put this check inside the if statement's parentheses."],
            objects: {},
            overview: "Similar to the data pipe, but only output values less than 10.\n\nUse an if statement to check if a value should be output. See the programmer's manual.",
            slot_count: 4,
            slot_names: ["x", "y", null, null],
            test_cases: [{
                input: [1, 9, 15, 34, 8, 4, 88],
                output: [1, 9, 8, 4]
            }, {
                input: [2, 0, 15, 82, 2, 7, 16],
                output: [2, 0, 2, 7]
            }, {
                input: [6, 1, 71, 89, 12, 42, 61, 20, 0],
                output: [6, 1, 0]
            }],
            bonus_line_count: 3,
            target_line_count: 3
        }
    },
    {
        puzzle_number: 5,
        title: 'Countdown',
        description: 'Countdowns are useful all over the system for timers, iteration, and building more complex logic.',
        data: {
            hints: ["The pipe filter isn't too far from this, but that if statement needs to change to a while loop.", "Use a while loop to output the value until it reaches 1, then you're done.", "Don't forget to subtract 1 from the value each time you go through the loop."],
            objects: {},
            overview: "For each value in the input, output all of the numbers from that to 1.\nFor example, if the input is 3, output 3, 2, then 1.\n\nUse a while loop to repeat blocks of code. See the programmer's manual.",
            slot_count: 5,
            slot_names: ["x", "y", null, null, null],
            test_cases: [{
                input: [3],
                output: [3, 2, 1]
            }, {
                input: [9, 6],
                output: [9, 8, 7, 6, 5, 4, 3, 2, 1, 6, 5, 4, 3, 2, 1]
            }, {
                input: [1, 1, 7, 1],
                output: [1, 1, 7, 6, 5, 4, 3, 2, 1, 1]
            }, {
                input: [17, 3, 2],
                output: [17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 3, 2, 1, 2, 1]
            }],
            bonus_line_count: 4,
            target_line_count: 5
        }
    },
    {
        puzzle_number: 6,
        title: 'Digit Extractor',
        description: 'Some modules only care about a certain digit position, and want to read only that place value.',
        data: {
            hints: ["Using x % 10 will give you just the digit in the ones place.", "Using x / 10 will shave off a digit. For example, 12 would become 1.", "How do you know that there are no more digits to output? What will the value be at that point?"],
            objects: {},
            overview: "For each value input, output each of their digits separately in reverse order.\nFor example, if the input is 123, output 3, then 2, then 1.\nAll inputs have at least one nonzero digit.\n\nTake advantage of modular artithmetic (%) and division (/).\nNote that dividing by a number always produces integers, there are no decimals.",
            slot_count: 5,
            slot_names: ["x", "y", null, null, null],
            test_cases: [{
                input: [1, 41, 65, 821],
                output: [1, 1, 4, 5, 6, 1, 2, 8]
            }, {
                input: [9, 26, 34],
                output: [9, 6, 2, 4, 3]
            }, {
                input: [928],
                output: [8, 2, 9]
            }, {
                input: [20, 17, 150],
                output: [0, 2, 7, 1, 0, 5, 1]
            }, {
                input: [200, 89, 102],
                output: [0, 0, 2, 9, 8, 2, 0, 1]
            }],
            bonus_line_count: 4,
            target_line_count: 6
        }
    },
    {
        puzzle_number: 7,
        title: 'Operator Selector',
        description: 'A more complex math module that can do multiple operations.',
        data: {
            hints: ["You can use z = cmd.next() to read what the command number is.", "Use if statements to separate the operations so you only do one."],
            objects: {
                cmd: "cmd"
            },
            overview: "For each two values in the input, perform the operation specified by the command component.\n\nCommands:\n1 - Addition\n2 - Subtraction\n3 - Multiplication\n4 - Division\n\nCall functions on the command object by using its name, a single period, and then the function.\nFor example, \"cmd.next()\" returns the next command input.",
            slot_count: 5,
            slot_names: ["x", "y", "z", null, null],
            test_cases: [{
                cmd: [1, 2, 3, 1],
                input: [1, 5, 2, 5, -2, 6, 1, 3],
                output: [6, -3, -12, 4]
            }, {
                cmd: [4, 3, 1, 2, 2],
                input: [6, 2, 8, 3, 1, -2, 9, 5, 0, 3],
                output: [3, 24, -1, 4, -3]
            }, {
                cmd: [1, 3],
                input: [1, 8, 0, -3],
                output: [9, 0]
            }, {
                cmd: [1, 4, 4, 2, 3],
                input: [7, 6, 12, 2, 12, 3, 1, -1, 3, 6],
                output: [13, 6, 4, 2, 18]
            }, {
                cmd: [2, 3, 3],
                input: [-6, 17, 9, 2, -2, -9],
                output: [-23, 18, 18]
            }],
            bonus_line_count: 9,
            target_line_count: 12
        }
    },
    {
        puzzle_number: 8,
        title: 'Array Summator',
        description: 'When encountering large amounts of data, array operations make analysis easier.',
        data: {
            hints: ["a[0] is the same as just a.", "You can use variables inside brackets to dynamically choose positions, like a[i].", "Use a while loop to iterate over the positions, adding them as you go."],
            objects: {},
            overview: "Output the sum of the variable labeled \"a\" and the nine positions after it (10) total then end the program.\n\nYou can use array notation to access variables relative to another - a[1] is the position one location after a.\n\nUse the \"end()\" function to stop your program's execution.", "can_rename": false,
            slot_count: 13,
            slot_names: ["a", null, null, null, null, null, null, null, null, null, "x", "y", "i"],
            test_cases: [{
                input: [],
                slots: [1, 8, 9, -2, 7, 5, 2, 0, 2, 6, 0, 0, 0],
                output: [36]
            }, {
                input: [],
                slots: [7, 2, 5, 1, -2, 15, -5, 6, -9, 2, 0, 0, 0],
                output: [22]
            }, {
                input: [],
                slots: [-11, -2, 0, 0, 0, 3, 6, -4, 3, 5, 0, 0, 0],
                output: [0]
            }, {
                input: [],
                slots: [-8, 2, -1, -5, 0, 2, 7, -1, -2, -4, 0, 0, 0],
                output: [-6]
            }],
            bonus_line_count: 4,
            target_line_count: 8
        }
    },
    {
        puzzle_number: 9,
        title: 'Array Reverser',
        description: 'If data is in the wrong order, reversing can solve that.',
        data: {
            hints: ["You'll need an extra variable to do the swap, since x = y, y = x just makes both variables equal to y.", "The first position goes to the end, and vice versa. The second becomes second-to-last, and so on.", "You can measure from the end of the array by subtracting an index from the length. You can do math inside brackets.", "If you keep swapping between the front and end, then you'll end your loop in the middle of the array."],
            objects: {},
            overview: "Reverse the data in the array starting at \"a\" and ending 9 slots after it (10) total.\nOutput nothing, end the program once the reverse is complete.", "can_rename": false,
            slot_count: 13,
            slot_names: ["a", null, null, null, null, null, null, null, null, null, "x", "y", "i"],
            test_cases: [{
                input: [],
                slots: [1, 8, 9, -2, 7, 5, 2, 0, 2, 6, 0, 0, 0],
                output: [],
                target: [6, 2, 0, 2, 5, 7, -2, 9, 8, 1]
            }, {
                input: [],
                slots: [7, 2, 5, 1, -2, 15, -5, 6, -9, 2, 0, 0, 0],
                output: [],
                target: [2, -9, 6, -5, 15, -2, 1, 5, 2, 7]
            }, {
                input: [],
                slots: [-11, -2, 0, 0, 0, 3, 6, -4, 3, 5, 0, 0, 0],
                output: [],
                target: [5, 3, -4, 6, 3, 0, 0, 0, -2, -11]
            }, {
                input: [],
                slots: [-8, 2, -1, -5, 0, 2, 7, -1, -2, -4, 0, 0, 0],
                output: [],
                target: [-4, -2, -1, 7, 2, 0, -5, -1, 2, -8]
            }],
            bonus_line_count: 6,
            target_line_count: 8
        }
    },
    {
        puzzle_number: 10,
        title: 'Shuffler',
        description: 'Pseudo-random shuffling helps create random data, which is useful for cryptography.',
        data: {
            hints: ["Start with swapping. If cmd.next() is 0, then just swap those positions like you did during each loop of the reverser. Be careful not to read input() more than twice.", "Your code for reversing applies here too, but you'll need to modify where it starts and ends based on the given inputs.", "Be careful with your variables: you don't have that many, so think about what you actually need to store and how long you need to keep it.", "Don't forget about the \"else\" statement; there's only two possible command inputs."],
            objects: {
                cmd: "cmd"
            },
            overview: "Shuffle the data in the array starting at \"a\" and ending 9 slots after it (10 total) according to the directions given.\n\nIf the command input is 0, read two values from input() and swap those array positions.\nIf the command input is 1, reverse the array positions between the two positions given by input() (inclusive).", "can_rename": false,
            slot_count: 13,
            slot_names: ["a", null, null, null, null, null, null, null, null, null, "x", "y", "i"],
            test_cases: [{
                cmd: [0, 1, 0, 0, 1, 0],
                input: [1, 9, 2, 7, 6, 9, 0, 2, 0, 5, 3, 5],
                slots: [1, 8, 9, -2, 7, 5, 2, 0, 2, 6, 0, 0, 0],
                output: [],
                target: [7, 5, 2, 0, 6, 1, 8, 9, 2, -2]
            }, {
                cmd: [1, 1, 1, 1],
                input: [2, 8, 0, 4, 1, 2, 4, 8],
                slots: [7, 2, 5, 1, -2, 15, -5, 6, -9, 2, 0, 0, 0],
                output: [],
                target: [-5, -9, 6, 2, 5, 1, -2, 15, 7, 2]
            }, {
                cmd: [0, 0, 0, 0, 1, 0],
                input: [0, 7, 5, 6, 1, 4, 8, 9, 3, 7, 1, 3],
                slots: [-11, -2, 0, 0, 0, 3, 6, -4, 3, 5, 0, 0, 0],
                output: [],
                target: [-4, -11, 0, 0, 3, 6, -2, 0, 5, 3]
            }, {
                cmd: [0, 0, 1, 1, 0, 1],
                input: [2, 8, 3, 5, 0, 5, 3, 9, 2, 5, 1, 4],
                slots: [-8, 2, -1, -5, 0, 2, 7, -1, -2, -4, 0, 0, 0],
                output: [],
                target: [-5, -1, -4, -1, 0, 2, 7, -8, 2, -2]
            }, {
                cmd: [1, 1, 0, 0, 0],
                input: [0, 5, 4, 9, 1, 8, 2, 5, 4, 7],
                slots: [9, 2, 5, 1, 5, -2, -1, 0, 8, 1, 0, 0, 0],
                output: [],
                target: [-2, 9, 8, 5, -1, 1, 0, 1, 5, 2]
            }, {
                cmd: [0, 0, 0, 0],
                input: [1, 6, 0, 5, 2, 3, 6, 8],
                slots: [3, 2, 3, 9, 3, 2, 1, -8, 1, 4, 0, 0, 0],
                output: [],
                target: [2, 1, 9, 3, 3, 3, 1, -8, 2, 4]
            }],
            bonus_line_count: 11,
            target_line_count: 16
        }
    },
    {
        puzzle_number: 11,
        title: 'Sorted Inserter',
        description: 'When data is already in sorted order, it\'s best to keep it that way.',
        data: {
            hints: ["If you keep the array sorted as you add elements, this is a lot easier.", "You could think of how you might sort a hand of cards: pick up one at a time, then shift it into position.", "Make sure you always keep track of how big the array has gotten. This number should only ever increase.", "For each input, move the items that are larger to the right by one position. Then add the new one to the open spot."],
            objects: {},
            overview: "Add each value from the input into the array starting at \"a\" and ending 9 slots after it (10) total.\nKeep the values in sorted order with lowest at the beginning and largest at the end.\n\nFor example, if the inputs are 1, 4, then 2, a[0] should be 1, a[1] should be 2, and a[2] should be 4.\n\nBoolean operators may be useful here. See the programmer's manual.", "can_rename": false,
            slot_count: 14,
            slot_names: ["a", null, null, null, null, null, null, null, null, null, "x", "y", "z", "i"],
            test_cases: [{
                input: [1, 4, 2, 8, 6, 3],
                output: [],
                target: [1, 2, 3, 4, 6, 8]
            }, {
                input: [6, -1, 2, 0, 7, 19, 6, 4],
                output: [],
                target: [-1, 0, 2, 4, 6, 6, 7, 19]
            }, {
                input: [2, -2, 0],
                output: [],
                target: [-2, 0, 2]
            }, {
                input: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                output: [],
                target: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            }, {
                input: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
                output: [],
                target: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            }],
            bonus_line_count: 9,
            target_line_count: 15
        }
    },
    {
        puzzle_number: 12,
        title: 'Full Sorter',
        description: 'When data is not sorted at all, it can be helpful to make it so.',
        data: {
            hints: ["Consider how you might sort just two items. Can you scale that up by doing repeated comparisons?", "You can try finding whatever the smallest item is and moving that to the start. Then repeat for the second-smallest, and so on.", "You could try to adapt your solution to the sorted inserter. Just be careful not to accidentally overwrite values.", "Don't forget to detect when you've finished sorting. Also, be careful of repeated values - don't waste time shifting them repeatedly."],
            objects: {},
            overview: "Sort the data in the array starting at \"a\" and ending 9 slots after it (10) total from least to greatest.\nOutput nothing, end the program once the sort is complete.", "can_rename": false,
            slot_count: 15,
            slot_names: ["a", null, null, null, null, null, null, null, null, null, "x", "y", "z", "r", "i"],
            test_cases: [{
                input: [],
                slots: [1, 8, 9, -2, 7, 5, 2, 0, 2, 6, 0, 0, 0, 0, 0],
                output: [],
                target: [-2, 0, 1, 2, 2, 5, 6, 7, 8, 9]
            }, {
                input: [],
                slots: [7, 2, 5, 1, -2, 15, -5, 6, -9, 2, 0, 0, 0, 0, 0],
                output: [],
                target: [-9, -5, -2, 1, 2, 2, 5, 6, 7, 15]
            }, {
                input: [],
                slots: [-11, -2, 0, 0, 0, 3, 6, -4, 3, 5, 0, 0, 0, 0, 0],
                output: [],
                target: [-11, -4, -2, 0, 0, 0, 3, 3, 5, 6]
            }, {
                input: [],
                slots: [-8, 2, -1, -5, 0, 2, 7, -1, -2, -4, 0, 0, 0, 0, 0],
                output: [],
                target: [-8, -5, -4, -2, -1, -1, 0, 2, 2, 7]
            }, {
                input: [],
                slots: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0, 0, 0, 0, 0],
                output: [],
                target: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            }, {
                input: [],
                slots: [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0, 0, 0, 0, 0],
                output: [],
                target: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            }],
            bonus_line_count: 9,
            target_line_count: 15
        }
    },
    {
        puzzle_number: 13,
        title: 'Stack Manager',
        description: 'A more advanced storage system that provides logic for retrieval.',
        data: {
            hints: ["You'll only ever interact with the stack at the end. Just track of how big it is.", "If you need to add a value, put it one past the end of the stack. To remove, just take the value at the end and return it."],
            objects: {
                cmd: "cmd"
            },
            overview: "Implement a \"stack\" storage system, responding to the commands requested.\nThe stack must be able to store at most 10 items.\n\nA stack is a first-in, last-out data structure. The items that are added first are the last to be removed.\nFor example, if 1, 2, then 3 are added to the stack, they will be removed in reverse order as 3, 2, then 1.\n\nCommands:\n1 - Take a value from input and add it to the stack.\n2 - Remove a value from the stack and send it to output.\n3 - Output the current number of items in the stack.",
            slot_count: 13,
            slot_names: ["a", null, null, null, null, null, null, null, null, null, "x", "y", "i"],
            test_cases: [{
                cmd: [1, 1, 3, 1, 3, 2, 3, 1, 2, 2, 1, 1, 1, 2, 2, 3],
                input: [6, 7, 9, 5, 3, 1, 8],
                output: [2, 3, 9, 2, 5, 7, 8, 1, 2]
            }, {
                cmd: [3, 1, 1, 2, 2, 1, 1, 3, 2, 1, 1, 3, 1, 2, 2, 2, 2],
                input: [1, 8, 0, 0, -1, 6, 5],
                output: [0, 8, 1, 2, 0, 3, 5, 6, -1, 0]
            }, {
                cmd: [1, 2, 1, 2, 1, 2, 3, 1, 1, 1, 3, 2, 2, 2, 3],
                input: [0, 5, -5, 2, 8, 6],
                output: [0, 5, -5, 0, 3, 6, 8, 2, 0]
            }, {
                cmd: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 1, 1, 3, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3],
                input: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
                output: [10, 9, 10, 12, 11, 8, 7, 15, 14, 13, 6, 5, 4, 3, 2, 1, 0]
            }],
            bonus_line_count: 9,
            target_line_count: 13
        }
    },
    {
        puzzle_number: 14,
        title: 'Palindrome Detector',
        description: 'With a working stack, more complex logic can be built.',
        data: {
            hints: ["Think about the case of just a single element. It's always a palindrome. How would you check for two values? Three?", "Reading from a stack happens in reverse order to what you added. That can help you mirror the values.", "Don't forget to account for the difference between odd and even lengths. x % 2 == 0 can detect if a value is even."],
            objects: {
                s: "stack",
                cmd: "cmd"
            },
            overview: "For each command input, determine if the corresponding number of values from input form a palindrome.\nOutput 1 if they do, and 0 if they do not.\n\nPalindromes are sequences of mirrored values. For example, \"1, 2, 2, 1\" and \"3, 4, 3\" are palindromes while \"1, 2, 3\" is not.\n\nThis module has access to the stack object, which uses s.push(...), s.pop(), and s.length(). See the programmer's manual.",
            slot_count: 15,
            slot_names: ["a", null, null, null, null, null, null, null, null, null, "x", "y", "z", "r", "i"],
            test_cases: [{
                cmd: [3, 4, 1, 5],
                input: [1, 2, 1, 1, 2, 2, 1, 4, 1, 2, 3, 4, 5],
                output: [1, 1, 1, 0]
            }, {
                cmd: [3, 1, 3, 1, 2],
                input: [1, 2, 3, 5, 5, 5, 5, 5, -1, 1],
                output: [0, 1, 1, 1, 0]
            }, {
                cmd: [2, 1, 2, 1],
                input: [5, 8, 5, 2, 1, 2],
                output: [0, 1, 0, 1]
            }],
            bonus_line_count: 13,
            target_line_count: 25
        }
    },
    {
        puzzle_number: 15,
        title: 'Key-Value Storage',
        description: 'With the other modules working, proper storage can be implemented.',
        data: {
            hints: ["Don't assume that you can just use the key as an index, since it might be out of range. You've got to make your own translation.", "You'll need to store both the key and the value, so that you can find the key later.", "You don't need to limit yourself to one array - you can split the variables up however you like. How about a separate array for keys and values?", "When storing, check if you already have that key and overwrite it if so. Otherwise, add a new key and find a spot for it."],
            objects: {
                cmd: "cmd"
            },
            overview: "Implement a key-value storage system that responds to the commands given.\nThis module must be able to store at most 5 unique keys. Items are never deleted.\n\nCommands:\n1 - Take two values from input. The first value is the key, and the second value is data. Keys may repeat.\n2 - Take one value from input. Output the value associated with this key.",
            slot_count: 15,
            slot_names: ["a", null, null, null, null, null, null, null, null, null, "x", "y", "z", "r", "i"],
            test_cases: [{
                cmd: [1, 1, 2, 2, 1, 1, 2, 2],
                input: [97, 2, 15, 3, 97, 15, -124, 9, 1, 8, 1, -124],
                output: [2, 3, 8, 9]
            }, {
                cmd: [1, 1, 2, 1, 2, 1, 2],
                input: [27, 18, 32, -185, 27, 51, 62, 32, 27, 64, 27],
                output: [18, -185, 64]
            }, {
                cmd: [1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 2],
                input: [1, -5, 2, -6, 3, -4, 4, -3, 5, -9, 1, 2, 3, 4, 5, 1, 6, 2, 3, 5, 4, 2, 5, 1],
                output: [-5, -6, -4, -3, -9, 3, 4, 6]
            }],
            bonus_line_count: 11,
            target_line_count: 25
        }
    }
]

export type PuzzleDataTestCase = {
    input: number[],
    output: number[],
    // these two get pulled into the below catch-all, so just leave them off
    // slots?: number[],
    // target?: number[],
    [key: string]: number[]
}

export type PuzzleData = {
    hints: string[],
    objects: { [key: string]: string },
    overview: string,
    can_rename?: boolean;
    slot_count: number,
    slot_names: (string | null)[],
    bonus_line_count: number,
    target_line_count: number,
    test_cases: PuzzleDataTestCase[];
}

export type PuzzleDefinition = {
    puzzle_number: number,
    title: string,
    description: string,
    data: PuzzleData
}

export function getPuzzleDefinition(puzzleNumber: number): PuzzleDefinition | undefined {
    return levels.find((l) => l.puzzle_number === puzzleNumber);
}

export function getAllPuzzles(): PuzzleDefinition[] {
    return levels.slice().sort((a: PuzzleDefinition, b: PuzzleDefinition) => a.puzzle_number - b.puzzle_number);
}
