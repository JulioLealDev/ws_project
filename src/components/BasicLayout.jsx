
import React from 'react';
import { useNavigate } from 'react-router-dom';


export const BasicLayout = ({ children, nextPage, loading=false, error }) => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="title">
        <p>Select the symptoms</p>
      </div>
      <div className="body">
        <form className="form">
          <div className="group">
            {loading ? (
              <h3 className="error">Loading Symptoms...</h3>
            ): error ? (
              <h3 className="error">{error.message}</h3>
            ) : children}
          </div>
    
          <div className="btn">
            <button onClick={() => navigate(nextPage)}>
              Other Symptoms
            </button>
            <button onClick={() => navigate('/page2')}>
              Proceed
            </button>
          </div>
        </form>
      </div>
    </div>)
  }