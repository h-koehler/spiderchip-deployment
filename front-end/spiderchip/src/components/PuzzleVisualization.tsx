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
import { useHorizontalScroll } from '../utils/useHorizontalScroll';

export default function PuzzleVisualization(props: {
    state: SpiderState,
    animations: SpiderAnimation[],
    animationSpeedScale: number
}) {
    const varslotsLength = props.state.varslots.length;
    const scrollRef = useHorizontalScroll<HTMLDivElement>();
    const [spiderPos, setSpiderPos] = useState<number | null>(null);
    const [spiderVals, setSpiderVals] = useState<(number | string)>("")
    const [localVarSlots, setLocalVarSlots] = useState(props.state.varslots);
    const [localObjs, setLocalObjs] = useState(props.state.objs);
    const [action, setAction] = useState("");
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const inactiveSpiderRef = useRef<(HTMLDivElement | null)>(null);
    const spiderRefs = useRef<(HTMLDivElement | null)[]>([]);
    const chipColor = {
        stack: {body: redChipBody, box: redChipBox},
        queue: {body: greenChipBody, box: greenChipBox},
        cmd: {body: purpleChipBody, box: purpleChipBox},
    }

    const animDuration = (dur: number) => {
        if (props.animationSpeedScale <= 1) {
            return 300 * dur;
        } else if (props.animationSpeedScale === 2) {
            return 100 * dur;
        } else {
            return 10 * dur;
        }
    }

    useEffect(() => {
        if (spiderPos === null && inactiveSpiderRef.current) {
            inactiveSpiderRef.current!.scrollIntoView({
                behavior: 'smooth',
            })
        } else if (spiderPos !== null && spiderRefs.current[spiderPos]) {
            spiderRefs.current[spiderPos]!.scrollIntoView({
                behavior: 'smooth',
            })
        }
    }, [spiderPos])

    useEffect(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        if (!props.animations || props.animations.length === 0) {
            setSpiderPos(null);
            setSpiderVals("")
            setAction("");
            setLocalVarSlots([...props.state.varslots]);
            setLocalObjs([...props.state.objs]);
            return;
        }

        let step = 0;

        setSpiderFromAnimation(props.animations[step]);
        intervalRef.current = setInterval(() => {
            if (step >= props.animations.length) {
                clearInterval(intervalRef.current!);
                setAction("");
                setSpiderVals("");
                intervalRef.current = null;

                return;
            }
            step++;
            setSpiderFromAnimation(props.animations[step]);

        }, animDuration(6));

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
    // only want to play animations if we get a full animation change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.animations]);

    function setSpiderFromAnimation(anim: SpiderAnimation) {
        // animations have 5 units of time to work with in their setTimeouts
        switch (anim.type) {
            case SpiderAnimationType.INPUT:
                // INPUT: show spider holding value
                setSpiderVals(anim.n);
                setSpiderPos(null);
                setAction("Inputting...");
                break;
            case SpiderAnimationType.LOAD:
                // LOAD: show spider getting value from slot
                setSpiderVals(anim.n);
                setSpiderPos(anim.slot);
                setAction("Reading...");
                break;
            case SpiderAnimationType.STORE:
                // STORE: show spider putting current value into slot
                setSpiderVals(anim.n);
                setSpiderPos(anim.slot);
                setAction("Writing...");
                setTimeout(() => {
                    setSpiderVals("")
                    setLocalVarSlots((prev) => {
                        const updated = [...prev];
                        updated[anim.slot] = {
                            ...updated[anim.slot],
                            value: anim.n, // Set the new value
                        };
                        return updated;
                    });
                }, animDuration(4));
                break;
            case SpiderAnimationType.MATH:
                setAction("Calculating...");
                setSpiderVals(`${anim.left} ${anim.operator} ${anim.right}`);
                setTimeout(() => {
                    setSpiderVals(anim.result);
                }, animDuration(3));
                break;
            case SpiderAnimationType.MATH_SHORTED:
                setAction("Calculating...");
                setSpiderVals(`${anim.left} ${anim.operator} ~~`)
                setTimeout(() => {
                    setSpiderVals(anim.result);
                }, animDuration(3));
                break;
            case SpiderAnimationType.MATH_UNARY:
                setAction("Calculating...");
                setSpiderVals(`${anim.operator}${anim.value}`)
                setTimeout(() => {
                    setSpiderVals(anim.result);
                }, animDuration(3));
                break;
            case SpiderAnimationType.OBJ_PUSH: {
                const objIndex = localObjs.findIndex(o => o.name === anim.object)
                const gridIndex = varslotsLength + objIndex
                setSpiderPos(gridIndex);
                setAction("Pushing...");
                setTimeout(() => {
                    setSpiderVals("")

                    setLocalObjs((prev) => {
                        const objects = [...prev];
                        const currObj = objects[objIndex]

                        const newContents = [...currObj.contents]
                        newContents.push(anim.n)

                        const newObj = new SpiderObject(currObj.type, currObj.name, newContents);
                        objects[objIndex] = newObj;
                        return objects;
                    });
                }, animDuration(3));
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
                    setSpiderVals(anim.n)
                }, animDuration(3));
                break;
            }
            case SpiderAnimationType.OUTPUT:
                setSpiderPos(null);
                setAction("Outputting...");
                setTimeout(() => {
                    setSpiderVals("")
                }, animDuration(3));
                break;
            case SpiderAnimationType.HALT:
                setSpiderPos(null);
                setAction("Halted");
                break;
        }
    }

    return (
        <div className="viz-container">
            <div className="viz-inner" ref={scrollRef}>
                <div className="label-grid">
                    {localVarSlots.map((slot, i) => (
                        <div className="label-slot" key={`var-${i}`} id={`slot-${i + 1}`}>
                            <div>{slot.name}</div>
                        </div>
                    ))}
                    {localObjs.map((obj, i) => {
                        return (
                            <div className="label-slot"
                                 key={i}
                                 id={`slot-${props.state.varslots.length + i + 1}`}
                            >
                                {obj.name}
                            </div>
                        );
                    })}
                </div>
                <div className="label-grid">
                    {localVarSlots.map((slot, i) => (
                        <div className="var-slot" key={i} id={`slot-${i + 1}`}>
                            <div className="chip-stack">
                                <div className="chip-bkg">
                                    <img src={blueChipBody}/>
                                </div>
                                <div className="chip-box">
                                    <img src={blueChipBox}/>
                                    <div className="chip-labels">
                                        <div>{slot.value}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {localObjs.map((obj, i) => {
                        const chip = chipColor[obj.type] || chipColor["stack"];
                        return (
                            <div className="var-slot"
                                 key={i}
                                 id={`slot-${props.state.varslots.length + i + 1}`}
                            >
                                <div className="chip-stack">
                                    <div className="chip-bkg">
                                        <img src={chip.body}/>
                                    </div>
                                    <div className="chip-box">
                                        <img src={chip.box}/>
                                        <div className="obj-labels">
                                            {obj.contents.slice(0, 3).map((v, io) => (
                                                <div key={io}>{v}</div>
                                            ))}
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
                            key={i}
                            ref={(el) => (spiderRefs.current[i] = el)}
                        >
                            {spiderPos === i && (<>
                                <div className="spider-icon">
                                    <FontAwesomeIcon icon={faSpider} size={"2xl"}/>
                                        <div className="spider-val-line">{spiderVals}</div>
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
                                key={index}
                                ref={(el) => (spiderRefs.current[index] = el)}
                            >
                                {spiderPos === index && (
                                    <div className="spider-icon">
                                        <FontAwesomeIcon icon={faSpider} size={"2xl"}/>
                                        <div className="spider-val-line">{spiderVals}</div>
                                        <p>{action}</p>
                                    </div>
                                    )}
                            </div>
                        );
                    })}
                </div>
                <div className="inactive-spider">
                    {spiderPos == null ? (
                        <div className="spider-icon" ref={inactiveSpiderRef}>
                            <FontAwesomeIcon icon={faSpider} size={"2xl"}/>
                            <div className="spider-val-line">{spiderVals}</div>
                            <p>{action}</p>
                        </div>
                        ) : null}
                </div>
                <div className="inputs-container">
                    <h3>Inputs:</h3>
                    <div className="inputs-value">
                        {props.state.input.map((v, i) => (
                            <span key={i}>{v}</span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
