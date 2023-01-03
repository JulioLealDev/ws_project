import React from "react";
import { useContext, useEffect, useState} from "react";
import "../style/Ranking.css";
import { useNavigate } from 'react-router-dom';
import { useReadCypher } from "use-neo4j";
import { DataContext } from "../database/DataContext";
import { getDiseases} from "../utils/getDiseases";

export const Ranking = () => {

    const context = useContext(DataContext)
    const [ranking, setRanking] = useState([])

    const navigate = useNavigate();

    const denormalizedSymptoms = context.state.selectedSymptoms.map((item) => item.replaceAll(" ", "_").toLowerCase());

    const { loading, error, result } = useReadCypher(`
        WITH $list as lst
        UNWIND lst AS x
        MATCH ( s:Symptom { name : x })-[r]->(d:Disease)
        WITH d, COUNT(d) AS quant, lst
        RETURN d, quant ORDER BY quant DESC`,{list:denormalizedSymptoms}
    );

    useEffect(() => { 
        if (result?.records) {
    
            setRanking(getDiseases({
                key: 'd',
                records: result?.records
            }).slice(0,5))
        }

    }, [result?.records])
   
    function getRanking() {
        return ranking.map((disease, index) => {
            return (
                <li key={`${disease}-${index}`}>
                    {disease}
                </li>
            )
        })
    }

    return (
        <div>
            <div className="bodyRanking">
                <div className="titleRanking">
                    <p id="ranking">Most likely diseases </p>
                </div>
                <div>
                    {loading ? (
                        <h3 className="error">Loading Ranking...</h3>
                    ): error ? (
                        <h3 className="error">{error.message}</h3>
                    ): <ul>
                          {getRanking()}
                       </ul>}  
                </div>
                <div className="btn">
                    <button className="btnRanking" onClick={() => navigate("/")}>Back to Home</button>
                </div>
            </div>
        </div>
    )
};