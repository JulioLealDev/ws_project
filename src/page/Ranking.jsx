import React from "react";
import { useContext, useEffect, useState} from "react";
import "../style/style.css";
import { Link, useNavigate } from 'react-router-dom';
import { useReadCypher } from "use-neo4j";
import { DataContext } from "../database/DataContext";
import { getData} from "../utils/getData";

export const Ranking = () => {

    const context = useContext(DataContext)
    const [ranking, setRanking] = useState([])

    const navigate = useNavigate();

    const desnormalizedSymptoms = context.state.selectedSymptoms.map((item) => item.replaceAll(" ", "_").toLowerCase());

    const { loading, error, result } = useReadCypher(`
        WITH $list as lst
        UNWIND lst AS x
        MATCH ( s:Symptom { name : x })-[r]->(d:Disease)
        WITH d, COUNT(d) AS quant, lst
        RETURN d, quant ORDER BY quant DESC`,{list:desnormalizedSymptoms}
    );

    useEffect(() => { 
        if (result?.records) {
    
            setRanking(getData({
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
        <>
            <section className="title">
                <Link class="logo" href='/'>
                    <img height="55px" width="55px" alt='teste'src="heart_icon_green.png"></img>
                    <h1 id="topTriage">TopTriage</h1>
                </Link>
            </section>
            <div className="resultDiv">
                <p>Most probable diseases </p>
                {loading ? (
                    <h2 className="error">Loading Ranking...</h2>
                ) : error ? (
                    <h2 className="error">{error.message}</h2>
                ) : <ul>
                    {getRanking()}
                </ul>}
            </div><div className="buttonsDiv">
                <button 
                    onClick={() => {
                        context.setState(oldState => ({
                            ...oldState,
                            selectedSymptoms: [],
                        }))
                        navigate('/')
                    }}
                >
                    Back to Home
                </button>
            </div>
         </>
    )
};