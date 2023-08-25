import React, { useEffect, useState } from "react";
import {
  FormControl,
  InputLabel,
  Input,
  Select,
  MenuItem,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import { fetchCities, updatePerson } from "../../api/api";

import "./popup.css";

function Popup(props) {
  const [counties, setCounties] = useState([]);
  const [cities, setCities] = useState([]);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [oldPhoneNumber, setOldPhoneNumber] = useState("");
  const [county, setCounty] = useState("");
  const [city, setCity] = useState("");
  const [submissionStatus, setSubmissionStatus] = useState(null);

  useEffect(() => {
    const fetchCitiesAsync = async () => {
      try {
        const response = await fetchCities();
        setCities(() => {
          const newCounties = Array.from(
            new Set(response.map((city) => city.county))
          );

          setCounties(newCounties);
          return response;
        });
      } catch (error) {
        setError(error);
      }
    };
    fetchCitiesAsync();
    if (props.personName) {
      setName(props.personName);
    }
    if (props.personPhoneNumber) {
      setPhoneNumber(props.personPhoneNumber);
      setOldPhoneNumber(props.personPhoneNumber);
    }
    if (props.personCountyName) {
      setCounty(props.personCountyName);
    }
    if (props.personCityName) {
      setCity(props.personCityName);
    }
  }, [props]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted:", { name, phoneNumber, county, city });

    const person = {
      name: name,
      phoneNumber: phoneNumber,
      city: {
        name: city,
        county: {
          name: county,
        },
      },
    };

    try {
      await updatePerson(oldPhoneNumber, person);
      setSubmissionStatus("success");
    } catch (error) {
      setSubmissionStatus("error");
      setError(error);
    }
  };

  const handleCloseButton = () => {
    if (submissionStatus === "success") {
      window.location.reload();
    }
    props.setTrigger(false);
  };

  if (error) {
    if (error.response.status !== 409) {
      let message = "Something went wrong.";
      return props.trigger ? (
        <div className="popup">
          <div className="popup-inner">
            <Button
              className="close-btn"
              color="error"
              variant="contained"
              onClick={() => props.setTrigger(false)}
            >
              X
            </Button>
            <Typography variant="h4">{message}</Typography>
          </div>
        </div>
      ) : (
        ""
      );
    }
  }

  if (!cities) {
    return null;
  }

  return props.trigger ? (
    <div className="popup">
      <div className="popup-inner">
        <Button
          className="close-btn"
          color="error"
          variant="contained"
          onClick={() => handleCloseButton()}
        >
          X
        </Button>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h4">Update person</Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Name</InputLabel>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Phone number</InputLabel>
                <Input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>County</InputLabel>
                <Select
                  value={county}
                  onChange={(e) => setCounty(e.target.value)}
                  label="County"
                >
                  {counties.map((countySelect) => (
                    <MenuItem key={countySelect.name} value={countySelect.name}>
                      {countySelect.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>City</InputLabel>
                <Select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  label="City"
                >
                  {county !== ""
                    ? cities
                        .filter(
                          (citySelect) => citySelect.county.name === county
                        )
                        .map((citySelect) => (
                          <MenuItem
                            key={citySelect.name}
                            value={citySelect.name}
                          >
                            {citySelect.name}
                          </MenuItem>
                        ))
                    : cities.map((citySelect) => (
                        <MenuItem key={citySelect.name} value={citySelect.name}>
                          {citySelect.name}
                        </MenuItem>
                      ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" variant="contained" color="success">
                update
              </Button>
            </Grid>
          </Grid>

          {submissionStatus === "success" && (
            <Typography variant="body1" color="success">
              Person update was successful!
            </Typography>
          )}
          {submissionStatus === "error" &&
            (error.response.status !== 409 ? (
              <Typography variant="body1" color="error">
                Error updating person. Please try again.
              </Typography>
            ) : (
              <Typography variant="body1" color="error">
                Phone number already exists. Please try again.
              </Typography>
            ))}
        </form>
      </div>
    </div>
  ) : (
    ""
  );
}

export default Popup;
