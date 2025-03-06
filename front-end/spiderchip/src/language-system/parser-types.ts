export class ParseResult {
    valid: boolean = false; // whether or not this parsed code is valid
    errors: ErrorMessage[] = []; // error messages if the code is not valid
    data: Data = new Data(); // parsed data segment
    text: (Line | undefined)[] = []; // parsed text segment, array index relative to line containing ".text" (not true source index)
}

export class ErrorMessage {
    line: number;
    msg: string;

    constructor(line: number, msg: string) {
        this.line = line;
        this.msg = msg;
    }
}

export class Data {
    tape: Slot[] = [];
    objects: Obj[] = [];
    labels: Label[] = [];
}

export class Slot {
    value: number = 0;
    name: string | undefined = undefined;
}

export class Obj {
    type: string;
    name: string;
    contents: number[];

    constructor(type: string, name: string, contents: number[]) {
        this.type = type;
        this.name = name;
        this.contents = contents;
    }
}

export class Label {
    name: string; // identifier for this label
    lineNumber: number; // line number within .text array

    constructor(name: string, lineNumber: number) {
        this.name = name;
        this.lineNumber = lineNumber;
    }
}

export class Line {
    indent: number;
    ast: ASTNode;

    constructor(indentLevel: number, ast: ASTNode) {
        this.indent = indentLevel;
        this.ast = ast;
    }
}

export class ASTNode {
    // There is no data in a basic node. All functionality contained in subclasses.
    constructor() { }

    static isNodeNumber(node: ASTNode) {
        return node instanceof ASTNumber;
    }

    static isNodeVarslot(node: ASTNode) {
        return node instanceof ASTVarslot;
    }

    static isNodeFunccall(node: ASTNode) {
        return node instanceof ASTFunccall;
    }

    static isNodeObjFunccall(node: ASTNode) {
        return node instanceof ASTObjFunccall;
    }

    static isNodeEquation(node: ASTNode) {
        return node instanceof ASTEquation;
    }

    static isNodeAssignment(node: ASTNode) {
        return node instanceof ASTAssignment;
    }

    static isNodeJump(node: ASTNode) {
        return node instanceof ASTJump;
    }

    static isNodeIf(node: ASTNode) {
        return node instanceof ASTIf;
    }

    static isNodeElse(node: ASTNode) {
        return node instanceof ASTElse;
    }

    static isNodeWhile(node: ASTNode) {
        return node instanceof ASTWhile;
    }
}

export class ASTNumber extends ASTNode {
    value: number;

    constructor(value: number) {
        super();
        this.value = value;
    }
}

export class ASTVarslot extends ASTNode {
    identifier: string; // root variable name
    offset: ASTNode | undefined; // equation defining offset from root varslot, if present

    constructor(identifier: string, offset: ASTNode | undefined = undefined) {
        super();
        this.identifier = identifier;
        this.offset = offset;
    }
}

export class ASTFunccall extends ASTNode {
    func: string; // function name to call
    equation: ASTNode | undefined; // sole function argument, if required

    constructor(func: string, equation: ASTNode | undefined = undefined) {
        super();
        this.func = func;
        this.equation = equation;
    }
}

export class ASTObjFunccall extends ASTNode {
    object: string; // object to call on, name from .data section (NOT object type)
    func: string; // function name to call
    equation: ASTNode | undefined; // sole function argument, if required

    constructor(object: string, func: string, equation: ASTNode | undefined = undefined) {
        super();
        this.object = object;
        this.func = func;
        this.equation = equation;
    }
}

type TEquationElements<TUnaryEq = boolean> = TUnaryEq extends false
    ? {
        // not unary
        unary: TUnaryEq;
        left: ASTNode; // left hand side of operator - evaluate this first due to short circuiting
        right: ASTNode; // right hand side of operator (not present if unary)
        operator: string; // && || < <= == >= > * / % + -
    }
    : {
        // is unary
        unary: TUnaryEq;
        left: ASTNode;
        operator: string; // ! -
    }

export class ASTEquation extends ASTNode {
    eq: TEquationElements;

    /**
     * Construct an equation node.
     * Assumed to be unary if `right` is null.
     */
    constructor(left: ASTNode, right: ASTNode | null, operator: string) {
        super();
        if (!right) {
            this.eq = {
                left: left,
                operator: operator,
                unary: true
            }
        } else {
            this.eq = {
                left: left,
                right: right,
                operator: operator,
                unary: false
            }
        }
    }
}

export class ASTAssignment extends ASTNode {
    varslot: ASTVarslot; // location to assign to
    equation: ASTNode; // value to be assigned

    constructor(varslot: ASTVarslot, equation: ASTNode) {
        super();
        this.varslot = varslot;
        this.equation = equation;
    }
}

export class ASTJump extends ASTNode {
    destination: string; // label name to jump to

    constructor(destination: string) {
        super();
        this.destination = destination;
    }
}

export class ASTIf extends ASTNode {
    equation: ASTNode; // equation in conditional

    constructor(equation: ASTNode) {
        super();
        this.equation = equation;
    }
}

export class ASTElse extends ASTNode {
    constructor() {
        super();
        // we don't need any data - our class alone is the indicator
    }
}

export class ASTWhile extends ASTNode {
    equation: ASTNode; // equation in conditional

    constructor(equation: ASTNode) {
        super();
        this.equation = equation;
    }
}
