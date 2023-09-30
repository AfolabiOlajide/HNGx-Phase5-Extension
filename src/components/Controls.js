import { createPortal } from "react-dom";
import Draggable from "react-draggable";

const Controls = ({ active }) => {
    return createPortal(
        <Draggable>
            <div
                className={`${
                    active ? "block" : "hidden"
                } 
                fixed bottom-[10%] left-[10%] rounded-full bg-black ring-4 ring-slate-300 text-white p-[1rem]
                cursor-pointer`}
            >
                <h1>Some text</h1>
            </div>
        </Draggable>,
        document.getElementById("controls")
    );
};

export default Controls;
