import React from "react";

interface TogglePanelProps {
  setIsSignUp: React.Dispatch<React.SetStateAction<boolean>>;
}

const TogglePanel: React.FC<TogglePanelProps> = ({ setIsSignUp }) => {
  return (
    <div className="toogle-container">
      <div className="toogle">
        <div className="toogle-panel toogle-left">
          <h1>Welcome User!</h1>
          <p>If you already have an account</p>
          <button className="bg-black" onClick={() => setIsSignUp(false)}>
            Sign In
          </button>
        </div>

        <div className="toogle-panel toogle-right">
          <h1>Hello, User!</h1>
          <p>If you don't have an account</p>
          <button className="bg-black" onClick={() => setIsSignUp(true)}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default TogglePanel;
