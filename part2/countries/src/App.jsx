import { useState, useEffect } from 'react'
import Find from './components/find';
import countriesService from './services/countriesService';
import Result from './components/results';


function App() {
  // const [search, setSearch] = useState("")
  const [countries, setCountries] = useState([])
  const [filtered, setFiltered] = useState([])

  const handleSearch = (event) => {
    const filtered = countries.filter(country => 
      country.name.common.toLowerCase()
      .includes(event.target.value.toLowerCase())
    );

    setFiltered(filtered)
    console.log(filtered)
  }

  useEffect(() => {
    countriesService
      .getAll()
      .then(response => {
        setCountries(response)
        console.log(response)
      })
  }, [])
  

  return (
      <div className="app-container">
        <Find handleKeywordChange={handleSearch} />
        <Result filtered={filtered}/>
      </div>
  );
}

export default App
