import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { DataContext } from '../database/DataContext';
import "../style/style.css";

export const BasicLayout = ({ children, loading=false, error, setSymptoms }) => {

  const navigate = useNavigate();
  const context = useContext(DataContext)
  const [searchParams, setSearchParams ] = useSearchParams();
  const [page, setPage] = useState(() => searchParams.get('page') || 1);
  const { state: stateContext, setState: setStateContext } = useContext(DataContext)


  const handleRemoveSymptom =  (e) => {
    const value = e.target.getAttribute("value")
    if(stateContext.selectedSymptoms.includes(value)){
        setStateContext(
            {
                ...stateContext, 
                selectedSymptoms: stateContext.selectedSymptoms.filter(item => item !== value)
            });
    }else{
        setStateContext(
            {
                ...stateContext, 
                selectedSymptoms:[ ...stateContext.selectedSymptoms, value]
            });
    }
  }
  
  const handlePage = (newPage) => {
    setSearchParams({page: newPage})
    setPage(newPage)
  }

  useEffect(() => {
    const initial = (page-1) * 24
    const final = initial + 24

    const items = context.state.remainingSymptoms.slice(initial,final)

    setSymptoms(items.sort())
  }, [page, context.state, setSymptoms])


  return (
    <div>
      <header className="title">
        <Link class="logo" to='/'>
          <img height="55px" width="55px" alt='teste'src="heart_icon_green.png"></img>
          <h1 id="topTriage">TopTriage</h1>
        </Link>
        <p id="homeTitle">Select the symptoms</p>
      </header>
      <div className="teste">
        <sidebar id="sidebar">
          <h2>Selected Symptoms</h2>
          {context.state.selectedSymptoms.map((symptom, index) => (
            <button key={`${symptom}-${index}`} className="selectedSymptoms" value={symptom} onClick={handleRemoveSymptom}> 
              {symptom}
            </button>
          ))}
        </sidebar>
        <main className="inputGroup">
          {loading ? (
            <h2 className="error">Loading Symptoms...</h2>
          ): error ? (
            <h2 className="error">{error.message}</h2>
          ): children}
        </main>
      </div>
      <footer className="buttonsDiv">
        <div>
          <button className="buttonsFooter" type="button" onClick={() => handlePage(Number(page) - 1)} disabled={page === 1}>
            Previous Page
          </button>
          <button className="buttonsFooter" type="button" onClick={() => handlePage(Number(page) + 1)} disabled={page === 6}>
            Next Page
          </button>
        </div>
        <button className="buttonsFooter" type="button" onClick={() => navigate('/result')}>
          Finish
        </button>
      </footer>
    </div>)
  }