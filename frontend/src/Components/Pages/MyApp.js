import React from "react";
import GetStarted from "./GetStarted";
import CreateAccount from "./CreateAccount";

function MyApp() {
  return (
    <div className="bg-blue-900 bg-opacity-60 min-h-screen">
      <GetStarted />
      <CreateAccount />
    </div>
  );
}

export default MyApp;
