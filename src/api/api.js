import axios from "axios";

const apiUrl = process.env.REACT_APP_API_URL;

export const fetchPeople = async () => {
  try {
    const response = await axios.get(`${apiUrl}/Person`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const fetchPeopleByName = async (name) => {
  try {
    const response = await axios.get(`${apiUrl}/Person/byname/${name}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const fetchPeopleByPhoneNumber = async (phoneNumber) => {
  try {
    const response = await axios.get(`${apiUrl}/Person/byphone/${phoneNumber}`);
    return [response.data];
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const fetchCounties = async () => {
  try {
    const response = await axios.get(`${apiUrl}/County`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const fetchCities = async () => {
  try {
    const response = await axios.get(`${apiUrl}/City`);
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createPerson = async (person) => {
  try {
    await axios.post(`${apiUrl}/Person`, person);
  } catch (error) {
    throw error;
  }
};

export const updatePerson = async (oldPhoneNumber, person) => {
  try {
    await axios.put(`${apiUrl}/Person/${oldPhoneNumber}`, person);
  } catch (error) {
    throw error;
  }
};
