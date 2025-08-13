import { use, useState } from "react";
import "./css/Modal.css"

export default function Modal({header, content, type, onClose, onAnswer}) {
    // expense page
    const [collectionName, setCollectionName] = useState("");
    const temp = Array.isArray(content) ? content.join(", ") : "";
    console.log(temp);

    return (
        <div className="modal-cover-page">
            <div className="modal-container-box">
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
                        <button onClick={onClose}> No</button>
                        <button onClick={() => onAnswer(true)}> Yes</button>

                    </>}

                    {type === "Okay" && <>
                        <button onClick={onClose}> Okay</button>
                    </>}

                    {type === "Create" && <>
                        <button onClick={onClose}> Cancel</button>
                        <button onClick={() => onAnswer(collectionName)}> Create</button>
                    </>}
                </div>
            </div>
        </div>
    );
}