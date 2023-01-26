import axios from 'axios';

export const limit = 40;
const BASE_URL = `https://pixabay.com/api/`;
const API_KEY = `32969662-b8725bfa5831874f5f8e98166`;
const searchParams = new URLSearchParams({
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: 'true',
  per_page: limit,
});

export async function fetchImages(searchValue, page) {
  const response = await axios.get(
    `${BASE_URL}?key=${API_KEY}&q=${searchValue}&${searchParams}&page=${page}`
  );

  const data = await response.data;
  return data;
}
