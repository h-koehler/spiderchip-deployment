import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/About.css';
import ReactMarkdown from 'react-markdown';
import paperBkg from '../assets/images/paper-background.svg';
const LanguageExplanation: React.FC = () => {
    const navigate = useNavigate();

    const markdown = `# 0. The Language System Object


Each puzzle must instantiate an instance of the language system object, which
will be called "SpiderRuntime". This example will refer to it as \`rt\`.

Each instance may only contain one program, but there is no global state that
would prevent making multiple (if for some reason you wanted to).


# 1. Initializing


### Creating and Initializing

The constructor for a SpiderRuntime will take a \`puzzle\` object (see below).
It will NOT do any initialization. Creation of a runtime object MUST always be
immediately followed by at least a call to \`rt.init(...)\`.

The \`rt.init(text, variables, caseNum)\` function initializes the object. This
will assign variable names, parse the users code, and prepare to execute the
named test case.

The following sections define the meaning of the placeholders used above.

### \`text\`

\`text\` is the .text segment as described by the language design. This is all
of the code that the user has typed. It may be an empty string.

Yes, this means that the entire code must be sent to the runtime for every
change. It would be a good idea to debounce user changes for a couple seconds
before sending it off to the parser for linting (with an early call if they
try to run it). This is why local execution is convenient - no network spam.

### \`variables\`

\`variables\` is an array of objects specifying the varslot names and default
values that the user has specified. It takes the following format:

\`\`\`JS
[
	{
		slot: 0,
		name: "x",
		value: 2
	},
	{
		slot: 1,
		name: "y"
	}
]
\`\`\`

Note that some puzzles may disallow changing the default value, so \`value\`
should always be absent in this case. Additionally, users are not able to
change the name of objects (e.g., cmd or stack objects defined by puzzles).

### \`puzzle\`

\`puzzle\` is a puzzle object which will manage knowledge about the puzzle. It
should be loaded when the user clicks into this puzzle.
The following entries will be present:
- \`slotCount: number\`: A number indicating how many varslots are present.
- \`canEdit: boolean\`: A boolean indicating if varslots can have their default values changed.
- \`canRename: boolean\`: A boolean indicating if varslots can be renamed.
- \`slotNames?: string[]\`: If \`canRename\` is false, the list of names to use. Index corresponds with slot number. Unnamed slots are \`undefined\`.
- \`testCases: object[]\`: An array of test case objects. Frontend only needs to look at the length of this to choose a random one on startup.

The \`testCases\` entry defines stuff like the .data objects (e.g., "is there a
stack?"), default slot values, and so on. The frontend must call \`rt.state()\`
(see below) immediately after initializing the runtime so that the visuals can
display these to the player as they start to write the code. Sorry if that's
inconvenient, but it's tricky since it can change per case.

I'm not sure what the structure of a test case object will look like at this
time, since I need to come up with a solution to apply the \`variables\` names
and expose logic for input/output management. That'll come with the puzzle
design itself, so I'm waiting.

### \`caseNum\`

\`caseNum\` is the test case number to use. This should not be changed randomly
each time the code is re-initialized, but rather chosen once from the
available tests and used until it has been solved successfully or indicated
as "dubious" (see section 3).

### Saving User Data

The \`text\` and \`variables\` objects constitute user data and would need to be
saved to the server to preserve progress. Shouldn't be too hard - the \`text\`
is quite literally just a string and \`variables\` is trivial JSON. Don't forget
the solved/skipped/available/locked flag.


# 2. Linting


Call \`rt.lint()\` to obtain linting output for the given code. The result will
be an array of objects containing information about linter errors. Each error
follows the structure shown below:

\`\`\`JS
[
	{
		line: 2,
		error: "Unexpected indentation"
	},
	{
		line: 14,
		error: "Unknown identifier 'x'"
	}
]
\`\`\`

Note that more than one error may appear per line, and some errors may not
appear during linting (e.g., if other parsing prevents them from showing up).

Line numbers will be offset such that the first line of the .text section is
line number 1.

It is important for the frontend to ensure that varslot names are legal, in
particular, that they follow the regex \`[A-z_][A-z0-9_]*\`. Failure to do so
would allow very likely allow the user to customize the .data section and
corrupt the puzzle's runtime environment.


# 3. Running


### Initializing

The runtime can be reset by calling \`rt.init(...)\` again. The frontend MUST
immediately call \`rt.state()\` to acquire the default state of all objects, as
test cases may have different initial variables.

### Stepping

The runtime can be advanced using the \`rt.step()\` function. This function will
always return nothing. Trying to step a halted/invalid program does nothing.

### Reading state

The current state can be checked using the \`rt.state()\` function. This will
return the following object. The "line" entry refers to the line that was
just executed by the previous \`rt.step()\`:

\`\`\`TS
interface SpiderObject {
	name: string,
	type: string,
	contents: number[]
}

interface SpiderState {
	varslots: number[],
	objs: SpiderObject[],
	state: string,
	line?: number,
	error?: string,
	case?: number
}
\`\`\`

Example (if the code is currently running):

\`\`\`JS
{
	varslots: [3, 6, 2, 1, 9, 2, 6],
	objs: [
		{
			name: "stack1",
			type: "stack",
			contents: [1, 2, 3]
		},
		{
			name: "stack2",
			type: "stack",
			contents: [5, 4]
		},
		{
			name: "cmd",
			type: "cmd",
			contents: []
		}
	],
	state: "running",
	line: 14
}
\`\`\`

Alternatively (if there is a parse error preventing running - see \`rt.lint()\`):

\`\`\`JS
{
	varslots: [0, 0],
	objs: [
		{
			name: "s",
			type: "stack",
			contents: [1, 2, 3]
		}
	],
	state: "invalid"
}
\`\`\`

Alternatively (if execution has not yet started and there are no parse errrs):

\`\`\`JS
{
	varslots: [1, 2, 0, 0, 0],
	objs: [],
	state: "new"
}
\`\`\`

Alternatively (if an error occurred):

\`\`\`JS
{
	varslots: [0, 0],
	objs: [],
	state: "error",
	line: 4,
	error: "Divide by zero"
}
\`\`\`

Alternatively (if the test failed/halted early):

\`\`\`JS
{
	varslots: [1, 2, 0, 0, 0],
	objs: [],
	state: "fail",
	line: 3
}
\`\`\`

Alternatively (if all test cases passed):

\`\`\`JS
{
	varslots: [1, 2, 0, 0, 0],
	objs: [],
	state: "success",
	line: 3
}
\`\`\`

Alternatively (if the test case passed but others failed):

\`\`\`JS
{
	varslots: [1, 2, 0, 0, 0],
	objs: [],
	state: "dubious",
	line: 3,
	case: 2
}
\`\`\`

The "dubious" case would occur if the running test case passed, but at least
one other did not. If this happens, the puzzle is NOT considered complete, and
the simulation should call for the case number specified in the "case" entry to
be run next (via the \`rt.init(...)\` function).

Whenever a test completes, the runtime will execute all tests to ensure that
the solution actually passes them all. So, if \`rt.state()\` returns "success",
the puzzle is considered complete.

### Animating

The animations for the previous step can be acquired using the \`rt.anim()\`
function. This will return a list of animations that should be displayed to
animate the change from the previous state to the current.

I don't have a design for animations yet. Focus on making the rest work and
then we can figure out what to do for animations.
`;

    return (
        <div className="about-container" style={{overflow: 'auto', maxHeight: '70vh'}}>
            <img 
                src={paperBkg} 
                alt="background image for about page" 
                className="background-image"
            />
            <div className="content-overlay">
                <h1>Language Explanation</h1>
                <div className="about-content">
                    <div className="markdown-body" style={{overflow: 'auto', maxHeight: '70vh'}}>
                        <ReactMarkdown>{markdown}</ReactMarkdown>
                    </div>
                </div>
                <button 
                    className="primary-button"
                    onClick={() => navigate('/about')}
                >
                    Back to About
                </button>
            </div>
            
        </div>
    );
};

export default LanguageExplanation;