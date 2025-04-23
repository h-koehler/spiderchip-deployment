import { ChangeEvent, useEffect, useState } from "react";
import { Puzzle, PuzzleTest, SpiderObject } from "../language-system/ls-interface-types";
import "./PuzzleSandboxControls.css"

const MAX_SLOTS = 15;
const MAX_ARRAY = 100;
const RE_IDENTIFIER = /^[A-Za-z_][A-Za-z0-9_]*$/;

type ObjectSetup = {
    type: string;
    name: string;
    values: number[];
}

export default function PuzzleSandboxControls(props: { big: boolean, onApply: (p: Puzzle) => void }) {
    const [errorMsg, setErrorMsg] = useState("");

    const [slotCount, setSlotCount] = useState(6);
    const [slotValues, setSlotValues] = useState([0, 0, 0, 0, 0, 0]);
    const [slotNames, setSlotNames] = useState(["a", "", "", "x", "y", "z"]);

    const [inputCount, setInputCount] = useState(5);
    const [inputValues, setInputValues] = useState([1, 2, 3, 4, 5]);

    const [outputCount, setOutputCount] = useState(5);
    const [outputValues, setOutputValues] = useState([5, 4, 3, 2, 1]);

    const [objects, setObjects] = useState<ObjectSetup[]>([{ type: "stack", name: "s", values: [] }])

    const changeSlotCount = (e: ChangeEvent<HTMLInputElement>) => {
        let newSize = Number.parseInt(e.target.value);
        if (newSize < 0) {
            newSize = 0;
        } else if (newSize > MAX_SLOTS) {
            newSize = MAX_SLOTS;
        }

        setSlotCount(newSize);
        if (slotValues.length < newSize) {
            setSlotValues([...slotValues, ...Array(newSize - slotValues.length).fill(0)]);
            setSlotNames([...slotNames, ...Array(newSize - slotNames.length).fill("")]);
        } else {
            setSlotValues(slotValues.slice(0, newSize));
            setSlotNames(slotNames.slice(0, newSize));
        }
    }

    const changeSlotValue = (value: number | string, index: number) => {
        let v = typeof value === "string" ? Number.parseInt(value) : value;
        if (v < -999) {
            v = -999;
        } else if (v > 999) {
            v = 999;
        }
        const newSlots = slotValues.slice();
        newSlots[index] = v;
        setSlotValues(newSlots);
    }

    const changeSlotName = (name: string, index: number) => {
        const newNames = slotNames.slice();
        newNames[index] = name.trim();
        setSlotNames(newNames);
    }

    const changeInputCount = (e: ChangeEvent<HTMLInputElement>) => {
        let newSize = Number.parseInt(e.target.value);
        if (newSize < 0) {
            newSize = 0;
        } else if (newSize > MAX_ARRAY) {
            newSize = MAX_ARRAY;
        }

        setInputCount(newSize);
        if (inputValues.length < newSize) {
            setInputValues([...inputValues, ...Array(newSize - inputValues.length).fill(0)]);
        } else {
            setInputValues(inputValues.slice(0, newSize));
        }
    }

    const changeInput = (value: number | string, index: number) => {
        let v = typeof value === "string" ? Number.parseInt(value) : value;
        if (v < -999) {
            v = -999;
        } else if (v > 999) {
            v = 999;
        }
        const newInputs = inputValues.slice();
        newInputs[index] = v;
        setInputValues(newInputs);
    }

    const changeOutputCount = (e: ChangeEvent<HTMLInputElement>) => {
        let newSize = Number.parseInt(e.target.value);
        if (newSize < 0) {
            newSize = 0;
        } else if (newSize > MAX_ARRAY) {
            newSize = MAX_ARRAY;
        }

        setOutputCount(newSize);
        if (outputValues.length < newSize) {
            setOutputValues([...outputValues, ...Array(newSize - outputValues.length).fill(0)]);
        } else {
            setOutputValues(outputValues.slice(0, newSize));
        }
    }

    const changeOutput = (value: number | string, index: number) => {
        let v = typeof value === "string" ? Number.parseInt(value) : value;
        if (v < -999) {
            v = -999;
        } else if (v > 999) {
            v = 999;
        }
        const newOutputs = outputValues.slice();
        newOutputs[index] = v;
        setOutputValues(newOutputs);
    }

    const addObject = () => {
        setObjects([...objects, { type: "", name: "", values: [] }]);
    }

    const removeObject = (i: number) => {
        setObjects([...objects.slice(0, i), ...objects.slice(i + 1)]);
    }

    const replaceObject = (i: number, o: ObjectSetup) => {
        setObjects([...objects.slice(0, i), o, ...objects.slice(i + 1)]);
    }

    const setObjectType = (i: number, type: string) => {
        replaceObject(i, { ...objects[i], type: type });
    }

    const setObjectName = (i: number, name: string) => {
        replaceObject(i, { ...objects[i], name: name.trim() });
    }

    const setObjectContentCount = (i: number, count: string) => {
        let length = Number.parseInt(count);
        if (length < 0) {
            length = 0;
        } else if (length > MAX_ARRAY) {
            length = MAX_ARRAY;
        }

        if (objects[i].values.length < length) {
            replaceObject(i, {
                ...objects[i], values: [
                    ...objects[i].values,
                    ...Array(length - objects[i].values.length).fill(0)]
            });
        } else {
            replaceObject(i, { ...objects[i], values: objects[i].values.slice(0, length) });
        }
    }

    const setObjectContentEntry = (i: number, value: string, pos: number) => {
        let v = Number.parseInt(value);
        if (v < -999) {
            v = -999;
        } else if (v > 999) {
            v = 999;
        }

        replaceObject(i, {
            ...objects[i], values: [
                ...objects[i].values.slice(0, pos), v, ...objects[i].values.slice(pos + 1)
            ]
        },);
    }

    const sendChanges = () => {
        let error = null;
        slotNames.forEach((v, i) => {
            if (v.length != 0 && !v.match(RE_IDENTIFIER)) {
                error = `Invalid slot name '${v}'`;
            } else if (v.length != 0 && slotNames.some((other, io) => i != io && other === v)) {
                error = `Duplicate slot name '${v}'`;
            }
        });
        objects.forEach((o, i) => {
            if (!o.name.match(RE_IDENTIFIER)) {
                error = `Invalid object name '${o.name || "(empty)"}'`;
            } else if (!o.type) {
                error = `Missing object type on '${o.name}'`;
            } else if (objects.some((other, io) => i != io && other.name === o.name)) {
                error = `Duplicate object name '${o.name}'`;
            } else if (slotNames.some((other) => o.name === other)) {
                error = `Object '${o.name}' has same name as a slot`;
            }
        });

        if (error) {
            setErrorMsg("Could not apply: " + error);
        } else {
            setErrorMsg("");
            const puzzle = new Puzzle(
                slotCount,
                [
                    new PuzzleTest(objects.map((o) =>
                        new SpiderObject(o.type, o.name, o.values)
                    ), slotValues, inputValues, outputValues)
                ],
                slotNames,
                false,
                false
            );
            props.onApply(puzzle);
        }
    }

    // initial change sending so we can out-propagate the defaults
    useEffect(() => {
        sendChanges();

        // we really do only want this to run once
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className={"controls-container" + (props.big ? " controls-container-big" : "")}>
            <div className="controls">
                <div className="slots">
                    <div className="control-line">
                        <p>Number of slots:</p>
                        <input type="number" value={slotCount} onChange={changeSlotCount} />
                    </div>
                    <div className="control-line">
                        <p>Slot values:</p>
                        {slotValues.map((v, i) =>
                            <input key={i} type="number" value={v} onChange={(e) => changeSlotValue(e.target.value, i)} />
                        )}
                    </div>
                    <div className="control-line">
                        <p>Slot names:</p>
                        {slotNames.map((n, i) =>
                            <input key={i} type="text" value={n} onChange={(e) => changeSlotName(e.target.value, i)} />
                        )}
                    </div>
                </div>
                <div className="input-output">
                    <div className="control-line">
                        <p>Input count:</p>
                        <input type="number" value={inputCount} onChange={changeInputCount} />
                    </div>
                    <div className="control-line">
                        <p>Inputs:</p>
                        {inputValues.map((v, i) =>
                            <input key={i} type="number" value={v} onChange={(e) => changeInput(e.target.value, i)} />
                        )}
                    </div>
                    <div className="control-line">
                        <p>Output count:</p>
                        <input type="number" value={outputCount} onChange={changeOutputCount} />
                    </div>
                    <div className="control-line">
                        <p>Outputs:</p>
                        {outputValues.map((v, i) =>
                            <input key={i} type="number" value={v} onChange={(e) => changeOutput(e.target.value, i)} />
                        )}
                    </div>
                </div>
                <div className="objects">
                    <button className="primary-button tiny-button" onClick={addObject}>Add Object</button>
                    {objects.map((o, i) => <div key={i} className="control-line">
                        <button className="primary-button tiny-button" onClick={() => removeObject(i)}>Remove</button>
                        <select value={o.type} onChange={(e) => setObjectType(i, e.target.value)}>
                            <option disabled value="">Select Type</option>
                            <option value="stack">Stack</option>
                            <option value="queue">Queue</option>
                            <option value="cmd">Command</option>
                        </select>
                        <p>Name:</p>
                        <input type="text" value={o.name} onChange={(e) => setObjectName(i, e.target.value)} />
                        <p>Contents Size:</p>
                        <input type="number" value={o.values.length} onChange={(e) => setObjectContentCount(i, e.target.value)} />
                        {o.values.length > 0 && <p>Contents:</p>}
                        {o.values.map((v, vi) =>
                            <input key={vi} type="number" value={v} onChange={(e) => setObjectContentEntry(i, e.target.value, vi)} />
                        )}
                    </div>)}
                </div>
                {errorMsg && <div className="errors">
                    <p>{errorMsg}</p>
                </div>}
                <button className="primary-button small-button" onClick={sendChanges}>Apply Puzzle</button>
            </div>
        </div>
    )
}
