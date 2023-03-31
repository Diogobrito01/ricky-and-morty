import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import CharacterList from './CharacterList';

const HomePage = () => {
  const [search, setSearch] = useState('');

  const handleSearch = event => {
    setSearch(event.target.value);
  }

  return (
    <>
      <SearchInput type="text" value={search} onChange={handleSearch} placeholder="Search for a character" />
      <CharacterList search={search} />
    </>
  );
}

const SearchInput = styled.input`
  display: block;
  margin: 20px auto;
  padding: 10px;
  border-radius: 30px;
  border: none;
  background-color: #F5F5F5;
  color: #333;
  font-size: 1.2rem;
  font-weight: bold;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  width: 80%;

  &:focus {
    outline: none;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

export default HomePage;
