import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataContext } from '../database/DataContext';

export const BasicLayout = ({ children, nextPage, loading=false, error }) => {

  const navigate = useNavigate();
  const context = useContext(DataContext)

  const handleShowContext = () => {
    console.log('sintomas: ', context.state.selectedSymptoms)
    console.log('doenças: ', context.state.probableIllnesses)
}

  return (
    <div>
      <div className="title">
        <p>Select the symptoms</p>
      </div>
      <div className="body">
        <form className="form">
          <div className="group">
            <div className="inputGroup">
              {loading ? (
                <h3 className="error">Loading Symptoms...</h3>
              ): error ? (
                <h3 className="error">{error.message}</h3>
              ): children}
            </div>
          </div>
    
          <div className="btn">
            <button  type="button" onClick={handleShowContext}>
              Show Context
            </button>
            <button  type="button" onClick={() => navigate(nextPage)}>
              Proceed
            </button>
          </div>
        </form>
      </div>
    </div>)
  }