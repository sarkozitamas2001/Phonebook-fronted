import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from "react-accessible-accordion";
import { Button, Typography } from "@mui/material";
import Search from "../search/search.js";
import Popup from "../popup/popup.js";

import "./phone-book.css";

import {
  fetchPeople,
  fetchPeopleByName,
  fetchPeopleByPhoneNumber,
} from "../../api/api.js";

const PhoneBook = () => {
  const [people, setPeople] = useState([]);
  const [error, setError] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [personName, setPersonName] = useState("");
  const [buttonPopup, setButtonPopup] = useState(false);
  const [updatePerson, setUpdatePerson] = useState({
    name: "",
    phoneNumber: "",
    city: {
      name: "",
      county: {
        name: "",
      },
    },
  });

  useEffect(() => {
    const fetchPeopleAsync = async () => {
      try {
        if (personName !== "") {
          const response = await fetchPeopleByName(personName);
          setPeople(response);
          setError(null);
        } else if (phoneNumber !== "") {
          const response = await fetchPeopleByPhoneNumber(phoneNumber);
          setPeople(response);
          setError(null);
        } else {
          const response = await fetchPeople();
          setPeople(response);
          setError(null);
        }
      } catch (error) {
        setError(error);
      }
    };
    fetchPeopleAsync();
  }, [phoneNumber, personName]);

  const handleOnSearchChange = (searchType, searchData) => {
    if (searchData !== null && searchData.trim() !== "") {
      if (searchType === "name") {
        setPersonName(searchData);
        setPhoneNumber("");
      } else {
        setPhoneNumber(searchData);
        setPersonName("");
      }
    }
  };

  const handleModify = (person) => {
    setButtonPopup(true);
    setUpdatePerson(person);
  };

  if (error) {
    let message = "Something is wrong on the server side.";
    if (error.response.status === 404) {
      message = "Person/people not found!";
    }
    return (
      <>
        <Search onSearchChange={handleOnSearchChange} />
        <div className="error-message">
          <Typography variant="h4">{message}</Typography>
        </div>
      </>
    );
  }

  if (!people) {
    return null;
  }

  return (
    <>
      {!buttonPopup ? <Search onSearchChange={handleOnSearchChange} /> : ""}
      <Accordion allowZeroExpanded allowMultipleExpanded>
        {people.map((person, index) => (
          <AccordionItem key={person.phoneNumber}>
            <AccordionItemHeading>
              <AccordionItemButton>
                <div className="person">
                  <label className="person-name">Name: {person.name}</label>
                  <label className="person-phone-number">
                    Phone-number: {person.phoneNumber}
                  </label>
                  <span>...</span>
                </div>
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <div className="person-details">
                <div className="person-details-item">
                  <label className="person-details-item-label">City: </label>
                  <label> {person.city.name}</label>
                </div>
                <div className="person-details-item">
                  <label className="person-details-item-label">County: </label>
                  <label> {person.city.county.name}</label>
                </div>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                  onClick={() => handleModify(person)}
                >
                  modify
                </Button>
              </div>
            </AccordionItemPanel>
          </AccordionItem>
        ))}
      </Accordion>
      <Popup
        trigger={buttonPopup}
        setTrigger={setButtonPopup}
        personName={updatePerson.name}
        personPhoneNumber={updatePerson.phoneNumber}
        personCityName={updatePerson.city.name}
        personCountyName={updatePerson.city.county.name}
      />
    </>
  );
};

export default PhoneBook;
