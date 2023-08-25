import React, { useState } from "react";
import "./App.css";
import PhoneBook from "./components/phone-book/phone-book";
import PersonCreation from "./components/person-creation/person-creation";

function App() {
  const [selectedTab, setSelectedTab] = useState("phoneBook");

  const handleTabClick = (tab) => {
    setSelectedTab(tab);
  };

  return (
    <div className="container">
      <div className="tabs">
        <button
          className={`tab ${selectedTab === "phoneBook" ? "active" : ""}`}
          onClick={() => handleTabClick("phoneBook")}
        >
          Phonebook
        </button>
        <span className="tab-button-selector"> | </span>
        <button
          className={`tab ${selectedTab === "addPerson" ? "active" : ""}`}
          onClick={() => handleTabClick("addPerson")}
        >
          Add Person
        </button>
      </div>
      <div className="content">
        {selectedTab === "phoneBook" ? <PhoneBook /> : <PersonCreation />}
      </div>
    </div>
  );
}

export default App;
