import React from "react";
import { useContext, useEffect, useState} from "react";
import { useReadCypher } from "use-neo4j";

import "../style/style.css";
import { useNavigate } from 'react-router-dom';
import { DataContext } from "../database/DataContext";
import { getData} from "../utils/getData";


export const Result = () => {

    const context = useContext(DataContext)
    const [specialist, setSpecialist] = useState([])

    const navigate = useNavigate();

    const denormalizedSymptoms = context.state.selectedSymptoms.map((item) => item.replaceAll(" ", "_").toLowerCase());

    const { loading, error, result } = useReadCypher(`
        WITH $list as lst
        UNWIND lst AS x
        MATCH (s:Symptom { name : x })-[r]->(d:Disease)
        WITH d, COUNT(d) AS quant ORDER BY quant DESC
        WITH d limit 5 
        MATCH (s:Specialist)-[r]->(d)
        WITH s, COUNT(s) AS quant ORDER BY quant DESC
        RETURN s limit 1`,{list:denormalizedSymptoms}
    );

    useEffect(() => { 
        if (result?.records) {
    
            setSpecialist(getData({
                key: 's',
                records: result?.records
            }))
        }

    }, [result?.records])

    return (
        <div>
            <div className="bodyPage">

                { context.state.selectedSymptoms.length === 0 ? (
                    <>
                        <div className="title">
                            <p>You din't select any symptoms.</p>
                            <p>Please go back and select the symptoms you have.</p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="title">
                            <p>You will be forwarded to the appointment with the </p>
                        </div><div>
                            {loading ? (
                                <h2 className="error">Loading data...</h2>
                            ) : error ? (
                                <h2 className="error">{error.message}</h2>
                            ) :
                                <h2>{specialist}</h2>}
                        </div>
                    </>
                )}

                <div className="btn">
                    <button onClick={() => navigate('/')}>Back</button>
                    <button onClick={() => navigate('/ranking')}>Ranking</button>
                </div>
            </div>
        </div>
    )
};