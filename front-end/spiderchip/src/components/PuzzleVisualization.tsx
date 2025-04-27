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

export default function PuzzleVisualization(props: {
    state: SpiderState,
    animations: SpiderAnimation[],
    setIsAnimating: (val: boolean) => void,
}) {
    const varslotsLength = props.state.varslots.length;
    const numVars = varslotsLength + props.state.objs.length;
    const gridStyle = {
        gridTemplateColumns: `repeat(${numVars}, 5em)`
    }
    const [spiderPos, setSpiderPos] = useState<number | null>(null);
    const [spiderVals, setSpiderVals] = useState<number[]>([])
    const [currentStep, setCurrentStep] = useState(0);
    const [localVarSlots, setLocalVarSlots] = useState(props.state.varslots)
    const [localObjs, setLocalObjs] = useState(props.state.objs);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        console.log("Effect triggered with animations:", props.animations.map(a => SpiderAnimationType[a.type]));
    }, [props.animations]);


    useEffect(() => {
        // DEBUG: showing what our new animations to visualize are
        // console.log(props.animations);
        // console.log("local:", localObjs);
        // console.log("props:", props.state.objs);
        // console.log("spiderPos:", spiderPos);
        // console.log(props.state.varslots);
        // console.log(localVarSlots);

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        if (!props.animations || props.animations.length === 0) {
            setSpiderPos(null);
            setSpiderVals([])
            setCurrentStep(0);
            setLocalVarSlots([...props.state.varslots]);
            setLocalObjs([...props.state.objs]);
            return;
        }

        let step = 0;
        setCurrentStep(step);

        props.setIsAnimating(true);

        intervalRef.current = setInterval(() => {
            if (step >= props.animations.length) {
                clearInterval(intervalRef.current!);
                intervalRef.current = null;
                props.setIsAnimating(false);

                return;
            }
            setSpiderFromAnimation(props.animations[step]);
            setCurrentStep(step)
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
        switch (anim.type) {
            case SpiderAnimationType.INPUT:
                // INPUT: show spider holding value
                setSpiderVals((prev) => {
                    const newVals = [...prev];
                    newVals.push(anim.n);
                    return newVals;
                });
                setSpiderPos(null);
                break;
            case SpiderAnimationType.LOAD:
                // LOAD: show spider getting value from slot
                setSpiderVals((prev) => [...prev, anim.n]);
                setSpiderPos(anim.slot);
                break;
            case SpiderAnimationType.STORE:
                // STORE: show spider putting current value into slot
                setSpiderPos(anim.slot);
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
                setSpiderVals([anim.result])
                break;
            case SpiderAnimationType.OBJ_PUSH: {
                const objIndex = localObjs.findIndex(o => o.name === anim.object)
                const gridIndex = varslotsLength + objIndex
                setSpiderPos(gridIndex)
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
                setSpiderPos(gridIndex)
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
                break;
        }
    }

    return (
        <div className="viz-container">
            <div className="viz-inner">
                <div className="slot-grid" style={gridStyle}>
                    {localVarSlots.map((slot, i) => (
                        <div className="var-slot filled" key={`var-${i}`} id={`slot-${i + 1}`}>
                            <div>{slot.value}</div>
                            <div>{slot.name}</div>
                        </div>
                    ))}
                    {localObjs.map((obj, i) => (
                        <div className="var-slot filled" key={`obj-${varslotsLength + i - 1}`}
                             id={`slot-${props.state.varslots.length + i + 1}`}>
                            {obj.contents.map((v, i) => (
                                <div key={`obj-${varslotsLength + i - 1}`}>{v}</div>
                            ))}
                            <div>{obj.name}</div>
                        </div>
                    ))}
                </div>
                <div className="spider-grid" style={gridStyle}>
                    {localVarSlots.map((_, i) => (
                        <div className="spider-slot" key={`spider-${i}`}>
                            {spiderPos === i && (
                                <div className="spider-icon">
                                    <FontAwesomeIcon icon={faSpider} size={"2xl"}/>
                                    {spiderVals.slice(0, 3).map((v, i) => (
                                        <div key={i} className="spider-val-line">{v}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    {localObjs.map((_, i) => (
                        <div className="spider-slot" key={`spider-${varslotsLength + i}`}>
                            {spiderPos === varslotsLength + i && (
                                <div className="spider-icon">
                                    <FontAwesomeIcon icon={faSpider} size={"2xl"}/>
                                    {spiderVals.slice(0, 3).map((v, i) => (
                                        <div key={varslotsLength + i} className="spider-val-line">{v}</div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
                <div className="inactive-spider">
                    { spiderPos == null ? (
                        <div className="spider-icon">
                            <FontAwesomeIcon icon={faSpider} size={"2xl"}/>
                            {spiderVals.slice(0, 3).map((v, i) => (
                                <div key={i} className="spider-val-line">{v}</div>
                            ))}
                        </div>
                    ) : null}
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
