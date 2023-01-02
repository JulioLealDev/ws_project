import React, {useContext} from "react";
import "../style/Home.css";
import Symptoms from "./Symptoms"
import { useNavigate } from 'react-router-dom';
import { DataContext } from "../database/DataContext";

export default function Home() {

    const context = useContext(DataContext)

    const navigate = useNavigate();
    
    const result = async e => {
        return navigate('/result');
    }

    const page2 = async e => {
        return navigate('/page2');
    }

    function refreshSymptons(symptoms){
        console.log('teste simp: '+symptoms)
    }

    return (
        <div>
            <div className="title">
                <p>Select the symptoms</p>
            </div>
            <div className="body">
                <form className="form">
                    <div className="group">
                        {<Symptoms/>}
                    </div>
                    
                    <div className="btn">
                        <button onClick={page2}>Other Symptoms</button>
                        {/* <button type="button" onClick={() => refreshSymptons(context.state.selectedSymptoms)}>Other Symptoms</button> */}
                        <button onClick={result}>Proceed</button>
                    </div>
                </form>
            </div>
        </div>
    )
};