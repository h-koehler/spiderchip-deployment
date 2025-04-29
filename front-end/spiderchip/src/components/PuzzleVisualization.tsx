import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faSpider} from '@fortawesome/free-solid-svg-icons'
import {useEffect, useRef, useState} from "react";
import {
    SpiderAnimation,
    SpiderAnimationType,
    SpiderObject,
    SpiderState,
} from "../language-system/ls-interface-types"
import "./PuzzleVisualization.css"
import blueChipBody from "../assets/images/blue-chip-body.png";
import blueChipBox from "../assets/images/blue-chip-box.png";
import redChipBody from "../assets/images/red-chip-body.png";
import redChipBox from "../assets/images/red-chip-box.png";
import greenChipBody from "../assets/images/green-chip-body.png";
import greenChipBox from "../assets/images/green-chip-box.png";
import purpleChipBody from "../assets/images/purple-chip-body.png";
import purpleChipBox from "../assets/images/purple-chip-box.png";

export default function PuzzleVisualization(props: {
    state: SpiderState,
    animations: SpiderAnimation[],
}) {
    const varslotsLength = props.state.varslots.length;
    // const numVars = varslotsLength + props.state.objs.length;
    // const gridStyle = {
    //     gridTemplateColumns: `repeat(${numVars}, 5em)`
    // }
    const [spiderPos, setSpiderPos] = useState<number | null>(null);
    const [spiderVals, setSpiderVals] = useState<number[]>([])
    const [currentStep, setCurrentStep] = useState(0);
    const [localVarSlots, setLocalVarSlots] = useState(props.state.varslots);
    const [localObjs, setLocalObjs] = useState(props.state.objs);
    const [action, setAction] = useState("");
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const spiderRefs = useRef<(HTMLDivElement | null)[]>([]);
    const chipColor = {
        stack: { body: redChipBody, box: redChipBox},
        queue: { body: greenChipBody, box: greenChipBox},
        cmd: { body: purpleChipBody, box: purpleChipBox},
    }

    useEffect(() => {
        console.log("Effect triggered with animations:", props.animations.map(a => SpiderAnimationType[a.type]));
    }, [props.animations]);

    useEffect(() => {
        if (spiderPos != null && spiderRefs.current[spiderPos]) {
            requestAnimationFrame(() => {
                spiderRefs.current[spiderPos]!.scrollIntoView({
                    behavior: 'smooth',
                })
            })
        }
    }, [spiderPos])

    useEffect(() => {
        // DEBUG: showing what our new animations to visualize are
        // console.log(props.animations);

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        if (!props.animations || props.animations.length === 0) {
            setSpiderPos(null);
            setSpiderVals([])
            setCurrentStep(0);
            setAction("");
            setLocalVarSlots([...props.state.varslots]);
            setLocalObjs([...props.state.objs]);
            return;
        }

        let step = 0;
        setCurrentStep(step);

        intervalRef.current = setInterval(() => {
            if (step >= props.animations.length) {
                clearInterval(intervalRef.current!);
                setAction("");
                intervalRef.current = null;

                return;
            }
            setSpiderFromAnimation(props.animations[step]);
            setCurrentStep(step);
            step += 1;

        }, 600);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
    }, [props.animations]);

    function setSpiderFromAnimation(anim: SpiderAnimation) {
        console.log(SpiderAnimationType[anim.type])
        switch (anim.type) {
            case SpiderAnimationType.INPUT:
                // INPUT: show spider holding value
                setSpiderVals((prev) => {
                    const newVals = [...prev];
                    newVals.push(anim.n);
                    return newVals;
                });
                setSpiderPos(null);
                setAction("Inputting...");
                break;
            case SpiderAnimationType.LOAD:
                // LOAD: show spider getting value from slot
                setSpiderVals((prev) => [...prev, anim.n]);
                setSpiderPos(anim.slot);
                setAction("Reading...");
                break;
            case SpiderAnimationType.STORE:
                // STORE: show spider putting current value into slot
                setSpiderPos(anim.slot);
                setAction("Writing...");
                setTimeout(() => {
                    setSpiderVals((prev) => {
                        const newVals = [...prev];
                        newVals.pop();
                        return newVals;
                    });

                    setLocalVarSlots((prev) => {
                        const updated = [...prev];
                        updated[anim.slot] = {
                            ...updated[anim.slot],
                            value: anim.n, // Set the new value
                        };
                        return updated;
                    });
                }, 500);
                break;
            case SpiderAnimationType.MATH:
                // MATH: show spider performing operation on values it is holding
                setAction("Calculating...");
                setTimeout(() => {
                    setSpiderVals([anim.result]);
                }, 300)
                break;
            case SpiderAnimationType.OBJ_PUSH: {
                const objIndex = localObjs.findIndex(o => o.name === anim.object)
                const gridIndex = varslotsLength + objIndex
                setSpiderPos(gridIndex);
                setAction("Pushing...");
                setTimeout(() => {
                    setSpiderVals((prev) => {
                        const newVals = [...prev];
                        newVals.pop();
                        return newVals;
                    });

                    setLocalObjs((prev) => {
                        const objects = [...prev];
                        const currObj = objects[objIndex]

                        const newContents = [...currObj.contents]
                        newContents.push(anim.n)

                        const newObj = new SpiderObject(currObj.type, currObj.name, newContents);
                        objects[objIndex] = newObj;
                        return objects;
                    });

                }, 300);
                break;
            }
            case SpiderAnimationType.OBJ_TAKE: {
                const objIndex = localObjs.findIndex(o => o.name === anim.object)
                const gridIndex = varslotsLength + objIndex;
                setSpiderPos(gridIndex);
                setAction("Taking...");
                setTimeout(() => {
                    setLocalObjs((prev) => {
                        const objects = [...prev];
                        const currObj = objects[objIndex];

                        const newContents = [...currObj.contents];
                        newContents.pop()

                        const newObj = new SpiderObject(currObj.type, currObj.name, newContents);
                        objects[objIndex] = newObj;
                        return objects;
                    })

                    setSpiderVals((prev) => {
                        const newVals = [...prev];
                        newVals.push(anim.n);
                        return newVals;
                    });
                }, 300)
                break;
            }
            case SpiderAnimationType.OUTPUT:
            case SpiderAnimationType.HALT:
                // OUTPUT or HALT: move spider to inactive pos
                setSpiderPos(null);
                setAction("Halted");
                break;
        }
    }

    return (
        <div className="viz-container">
            <div className="viz-inner">
                <div className="slot-grid">
                    {localVarSlots.map((slot, i) => (
                        <div className="var-slot" key={`var-${i}`} id={`slot-${i + 1}`}>
                            <div className="chip-stack">
                                <div className="chip-bkg">
                                    <img src={blueChipBody}/>
                                </div>
                                <div className="chip-box">
                                    <img src={blueChipBox}/>
                                    <div className="chip-labels">
                                        <div>{slot.value}</div>
                                        <div>{slot.name}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {localObjs.map((obj, i) => {
                        const chip = chipColor[obj.type] || chipColor["stack"];
                        return (
                            <div className="var-slot"
                                 key={`obj-${varslotsLength + i - 1}`}
                                 id={`slot-${props.state.varslots.length + i + 1}`}
                            >
                                <div className="chip-stack">
                                    <div className="chip-bkg">
                                        <img src={chip.body}/>
                                    </div>
                                    <div className="chip-box">
                                        <img src={chip.box}/>
                                        <div className="chip-labels">
                                            {obj.contents.slice(0, 3).map((v, i) => (
                                                <div key={`obj-${varslotsLength + i - 1}`}>{v}</div>
                                            ))}
                                            <div>{obj.name}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="spider-grid">
                    {localVarSlots.map((_, i) => (
                        <div
                            className="spider-slot"
                            key={`spider-${i}`}
                            ref={(el) => (spiderRefs.current[i] = el)}
                        >
                            {spiderPos === i && (<>
                                <div className="spider-icon">
                                    <FontAwesomeIcon icon={faSpider} size={"2xl"}/>
                                    {spiderVals.slice(0, 3).map((v, i) => (
                                        <div key={i} className="spider-val-line">{v}</div>
                                    ))}
                                </div>
                                <p>{action}</p>
                            </>)}
                        </div>
                    ))}
                    {localObjs.map((_, i) => {
                        const index = varslotsLength + i;
                        return (
                            <div
                                className="spider-slot"
                                key={`spider-${index}`}
                                ref={(el) => (spiderRefs.current[index] = el)}
                            >
                                {spiderPos === index && (<>
                                    <div className="spider-icon">
                                        <FontAwesomeIcon icon={faSpider} size={"2xl"}/>
                                        {spiderVals.slice(0, 3).map((v, i) => (
                                            <div key={i} className="spider-val-line">{v}</div>
                                        ))}
                                    </div>
                                    <p>{action}</p>
                                </>)}
                            </div>
                        );
                    })}
                </div>
                <div className="inactive-spider">
                    {spiderPos == null ? (<>
                        <div className="spider-icon">
                            <FontAwesomeIcon icon={faSpider} size={"2xl"}/>
                            {spiderVals.slice(0, 3).map((v, i) => (
                                <div key={i} className="spider-val-line">{v}</div>
                            ))}
                        </div>
                        <p>{action}</p>
                    </>) : null}
                </div>
                <div className="inputs-container">
                    {props.state.input.map((v) => (
                        <span>{v}</span>
                    ))}
                </div>
            </div>
        </div>
    )
}
