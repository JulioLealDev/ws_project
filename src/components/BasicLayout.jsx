import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { DataContext } from '../database/DataContext';
import "../style/style.css";

export const BasicLayout = ({ children, loading=false, error, setSymptoms }) => {

  const navigate = useNavigate();
  const context = useContext(DataContext)
  const [searchParams, setSearchParams ] = useSearchParams();
  const [page, setPage] = useState(() => searchParams.get('page') || 1);


  // const handleRefreshSymptoms = () => {

  //     const newSymptoms = context.state.remainingSymptoms.slice(0,24)

  //     setSymptoms(newSymptoms)

  //     context.setState(
  //       {
  //           ...context.state, 
  //           remainingSymptoms: context.state.remainingSymptoms.filter(item => !newSymptoms.includes(item))
  //       }
  //     )

  // }
  
  const handlePage = (newPage) => {
    setSearchParams({page: newPage})
    setPage(newPage)
  }

  useEffect(() => {
    console.log(page)
    const initial = (page-1) * 24
    const final = initial + 24

    console.log(context.state.remainingSymptoms)

    const items = context.state.remainingSymptoms.slice(initial,final)

    console.log(items)

    setSymptoms(items)
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
      <main className="inputGroup">
        {loading ? (
          <h2 className="error">Loading Symptoms...</h2>
        ): error ? (
          <h2 className="error">{error.message}</h2>
        ): children}
      </main>
      <footer className="buttonsDiv">
        <div>
          <button type="button" onClick={() => handlePage(Number(page) - 1)} disabled={page === 1}>
            Previous Page
          </button>
          <button type="button" onClick={() => handlePage(Number(page) + 1)} disabled={page === 6}>
            Next Page
          </button>
        </div>
        <button type="button" onClick={() => navigate('/result')}>
          Finish
        </button>
      </footer>
    </div>)
  }