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
import { createPerson, fetchCities } from "../../api/api";

const PersonCreation = () => {
  const [counties, setCounties] = useState([]);
  const [cities, setCities] = useState([]);
  const [error, setError] = useState(null);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
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
  }, []);

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
      await createPerson(person);
      setSubmissionStatus("success");
    } catch (error) {
      setSubmissionStatus("error");
    }
  };

  if (error) {
    if (error.response.status !== 409) {
      let message = "Something went wrong.";
      return (
        <>
          <div className="error-message">
            <Typography variant="h4">{message}</Typography>
          </div>
        </>
      );
    }
  }

  if (!cities) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4">Add a New Person</Typography>
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
                    .filter((citySelect) => citySelect.county.name === county)
                    .map((citySelect) => (
                      <MenuItem key={citySelect.name} value={citySelect.name}>
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
            Submit
          </Button>
        </Grid>
      </Grid>

      {submissionStatus === "success" && (
        <Typography variant="body1" color="success">
          Person created successfully!
        </Typography>
      )}
      {submissionStatus === "error" &&
        (error.response.status !== 409 ? (
          <Typography variant="body1" color="error">
            Error updating person. Please try again.
          </Typography>
        ) : (
          <Typography variant="body1" color="error">
            Person with this phone number already exists. Please try again.
          </Typography>
        ))}
    </form>
  );
};

export default PersonCreation;
