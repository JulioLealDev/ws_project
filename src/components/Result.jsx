import React from "react";
import "../style/Result.css";
import especialistas from "../database/Especialistas";
import { useNavigate } from 'react-router-dom';

export default function Result() {

    const navigate = useNavigate();

    function getEspecialistas() {
        return especialistas.map(especialista => {
            return (
                <h2>
                        {especialista.nome}
                </h2>
            )
        })
    }

    const home = async e => {
        return navigate('/');
    }

    const ranking = async e => {
        return navigate('/ranking');
    }

    let random = Math.floor(Math.random() * 16);

    return (
        <div>
            <div className="bodyResult">
                <div className="titleResult">
                    <p id="result">You will be forwarded to the appointment with the </p>
                </div>
                <div>
                     {getEspecialistas()[random]}
                </div>
                <div className="btn">
                    <button className="btnResult" onClick={home}>Back</button>
                    <button className="btnResult" onClick={ranking}>Ranking</button>
                </div>
            </div>
        </div>
    )
};