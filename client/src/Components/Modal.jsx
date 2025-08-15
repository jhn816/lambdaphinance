import { use, useEffect, useState } from "react";
import "./css/Modal.css"

export default function Modal({status, header, content, type, onClose, onAnswer}) {
    // expense page
    const [collectionName, setCollectionName] = useState("");
    const temp = Array.isArray(content) ? content.join(", ") : "";

    // animation 
    const [animate, setAnimate] = useState(status); // not none
    const [visible, setVisible] = useState(true);
    const [action, setAction] = useState("");

    useEffect( ()=> {
        if (animate !== "none") {
            setVisible(true);
        } else {
            setVisible(false)

            if (action === "true") {
                const j = setTimeout( () => {onAnswer(true)}, 300);
                return () => clearTimeout(j);
            } else if (action === "collection") {
                const j = setTimeout( () => {onAnswer(collectionName)}, 300);
                return () => clearTimeout(j);
            } else {
                const j = setTimeout( () => {onClose()}, 300);
                return () => clearTimeout(j);
            }
        }
    }, [animate, visible])


    return (
        <div className={`modal-cover-page ${visible ? "modal-fade-in" : "modal-fade-out"}`}>
            <div className={`modal-container-box ${visible ? "modal-fade-in" : "modal-fade-out"}`}>
                <div className="modal-main-content">
                    <h3> {header} </h3>
                    {Array.isArray(content) ? 
                        <p>{temp} </p> : 
                        <p> {content} </p>
                    }
                    {type === "Create" &&
                        <input placeholder="Enter Collection Name..." onChange={(e) => (setCollectionName(e.target.value))} maxLength={20}/>
                    }
                </div>
            
                <div className="modal-buttons">
                    {type === "YesNo" && <>
                        <button onClick={() => setAnimate("none")}> No</button>
                        <button onClick={() => {setAnimate("none"); setAction("true");}}> Yes</button>

                    </>}

                    {type === "Okay" && <>
                        <button onClick={() => setAnimate("none")}> Okay</button>
                    </>}

                    {type === "Create" && <>
                        <button onClick={() => setAnimate("none")}> Cancel</button>
                        <button onClick={() => {setAnimate("none"); setAction("collection");}}> Create</button>
                    </>}
                </div>
            </div>
        </div>
    );
}