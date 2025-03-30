import {LevelItem} from "../types.ts";
import DetailsIcon from '../assets/images/details-icon.png'
import "./PuzzleDetails.css"

export default function PuzzleDetails(props: { level: LevelItem }) {
    return (
        <div className="details">
            <div className="header">
                <img src={DetailsIcon}/>
            </div>
            <div className="text">
                <h2>{props.level.title}</h2>
                <p> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi id eros at mi ultrices accumsan.
                    Maecenas ultrices tempor felis fringilla porttitor. Nulla porta blandit quam. Sed nec sodales neque,
                    sit amet tristique enim. Sed scelerisque elit massa, sit amet varius ante aliquam vel. Nullam
                    efficitur, orci nec sagittis bibendum, mauris eros luctus mi, sed pretium enim velit in lorem.
                    Mauris rhoncus suscipit ipsum vitae lobortis. Sed a placerat lorem. Praesent ac diam libero.

                    Nam finibus, arcu in pharetra hendrerit, enim libero suscipit velit, ac sagittis dui metus ut lorem.
                    Nunc a enim varius, pharetra nisi a, molestie neque. Aliquam tempus efficitur porttitor. Duis leo
                    tortor, interdum sit amet consectetur vel, egestas vitae turpis. Duis venenatis porta cursus. Nulla
                    scelerisque lacus sollicitudin urna maximus, vitae mattis turpis aliquet. Maecenas placerat faucibus
                    sapien eget hendrerit. Maecenas in dui nibh. In hac habitasse platea dictumst. Vestibulum volutpat
                    convallis convallis. Phasellus consectetur, sem nec lobortis placerat, elit nisl dignissim diam, at
                    vehicula lectus lectus eu nulla. Nulla ut blandit purus. Cras consectetur aliquet maximus. Curabitur
                    ligula nibh, bibendum vitae mi vel, auctor sodales est. </p>
            </div>
        </div>
    )
}