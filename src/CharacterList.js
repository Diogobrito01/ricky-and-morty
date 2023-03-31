import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

const CharacterList = () => {
  const [characters, setCharacters] = useState([]);
  const [page, setPage] = useState(1);
  const [info, setInfo] = useState({});
  const [favorites, setFavorites] = useState([]);
  const [originalCharacters, setOriginalCharacters] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    axios.get(`https://rickandmortyapi.com/api/character?page=${page}`)
      .then(res => {
        setCharacters(res.data.results);
        setOriginalCharacters(res.data.results);
        setInfo(res.data.info);
      });
  }, [page]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites'));
    if (storedFavorites) {
      setFavorites(storedFavorites);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < info.pages) {
      setPage(page + 1);
    }
  };

  const sortCharacters = () => {
    const favoritesSet = new Set(favorites);
    return originalCharacters
      .filter((character) =>
        character.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        if (favoritesSet.has(a.id) && favoritesSet.has(b.id)) {
          return 0;
        } else if (favoritesSet.has(a.id)) {
          return -1;
        } else {
          return 1;
        }
      });
  };


  const updateCharacterPosition = (characterId, newIndex) => {
    const targetIndex = characters.findIndex(c => c.id === characterId);
    if (targetIndex !== -1) {
      const newCharacters = [...characters];
      const [removed] = newCharacters.splice(targetIndex, 1);
      newCharacters.splice(newIndex, 0, removed);
      setCharacters(newCharacters);
    }
  };


  return (
    <Wrapper>
      <Titulo>
        <h1>Rick and Morty</h1>
      </Titulo>

      <SearchInput
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Pesquisar personagem"
      />
      <CharacterGrid>
        {sortCharacters().map(character => (
          <CharacterCard key={character.id}>
            <img src={character.image} alt={character.name} />
            <h2 title={character.name}>{character.name}</h2>
            <p>Status: {character.status}</p>
            <p>Species: {character.species}</p>
            <p>Gender: {character.gender}</p>
            <button onClick={() => {
              const { id } = character;
              if (favorites.includes(id)) {
                setFavorites(favorites.filter(fav => fav !== id));
                const originalIndex = originalCharacters.findIndex(c => c.id === id);
                updateCharacterPosition(id, originalIndex);
              } else {
                setFavorites([...favorites, id]);
              }
            }}>
              {favorites.includes(character.id) ? "Remove from Favorites" : "Add to Favorites"}
            </button>
          </CharacterCard>
        ))}
      </CharacterGrid>

      <PaginationBar>
        <NavigationButton onClick={handlePrevPage} disabled={page === 1}>
          Previous
        </NavigationButton>

        <PageNumbers>
          {page > 1 && (
            <>
              <PageNumber onClick={() => setPage(1)}>1</PageNumber>
              {page > 2 && <PaginationDivider>...</PaginationDivider>}
            </>
          )}

          {[...Array(info.pages)].map((_, index) => (
            (index >= page - 3 && index <= page + 1) && (
              <PageNumber
                key={index}
                active={page === index + 1}
                onClick={() => setPage(index + 1)}
              >
                {index + 1}
              </PageNumber>
            )
          ))}

          {page < info.pages && (
            <>
              {page < info.pages - 2 && <PaginationDivider>...</PaginationDivider>}
              <PaginationOptions>
                {[...Array(Math.min(5, info.pages - page))].map((_, index) => (
                  <PageNumber
                    key={index}
                    active={false}
                    onClick={() => setPage(page + index + 1)}
                  >
                    {page + index + 1}
                  </PageNumber>
                ))}
              </PaginationOptions>
            </>
          )}
        </PageNumbers>

        <NavigationButton onClick={handleNextPage} disabled={page === info.pages}>
          Next
        </NavigationButton>
        <p>Foram encontrados {info.count} personagens</p>
      </PaginationBar>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Titulo = styled.div`
  display: flex;
  justify-content: center;

  & h1 {
    font-size: 3rem;
    color: #333;
    margin-right: 2rem;
  }
`;

const CharacterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  justify-items: center;
`;

const CharacterCard = styled.div`{
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  padding: 1rem;
  margin: 1rem;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease-out;

  img {
    max-width: 100%;
    height: auto;
    border-radius: 5px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }

  h2 {
    font-size: 1.5rem;
    font-weight: bold;
    margin: 0;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: calc(100% - 2rem);
  }

  p {
    font-size: 1rem;
    font-weight: normal;
    margin: 0.3rem 0;
    text-align: center;
  }

  button {
    margin-top: 0.5rem;
    padding: 0.5rem 1rem;
    background-color: ${props => props.active ? '#333' : '#fff'};
    color: ${props => props.active ? '#fff' : '#333'};
    border: 1px solid #ccc;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      background-color: #333;
      color: #fff;
    }
  }

  &:hover {
    transform: translateY(-10px);
  }
`;


const PaginationBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2rem;
`;

const NavigationButton = styled.button`
  margin: 0 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #fff;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const PageNumbers = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PageNumber = styled.div`
  margin: 0 0.5rem;
  padding: 0.5rem 1rem;
  background-color: ${props => props.active ? '#333' : '#fff'};
  color: ${props => props.active ? '#fff' : '#333'};
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #333;
    color: #fff;
  }
`;

const PaginationDivider = styled.div`
  margin: 0 0.5rem;
  padding: 0.5rem 0;
  font-size: 1.2rem;
  font-weight: bold;
`;

const PaginationOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 1160px;
  height: 40px;
  padding: 0 1rem;
  margin: 0 auto;
  border-radius: 20px;
  border: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  font-size: 1.2rem;
  color: #333;
  background-color: #fff;

  &:focus {
    outline: none;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  }

  &::placeholder {
    color: #999;
  }
`;

export default CharacterList;
