import React from "react";
import "../style/Ranking.css";
import diseases from "../database/Diseases";
import { useNavigate } from 'react-router-dom';

export default function Ranking() {

    const navigate = useNavigate();

    function getDiseases() {
        return diseases.map(disease => {
            return (
                <li>
                    {disease.nome}
                </li>
            )
        })
    }

    const home = async e => {
        return navigate('/');
    }

    return (
        <div>
            <div className="bodyRanking">
                <div className="titleRanking">
                    <p id="ranking">Most likely diseases </p>
                </div>
                <div>
                    <ul>
                       {getDiseases()}
                    </ul>
                </div>
                <div className="btn">
                    <button className="btnRanking" onClick={home}>Back to Home</button>
                </div>
            </div>
        </div>
    )
};