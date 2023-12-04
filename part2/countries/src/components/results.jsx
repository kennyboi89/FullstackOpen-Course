import Country from "./country";

const Result = ({filtered}) => {
    
    if (filtered.length === 0)
    {
        return (
            <div className="result-container">
            </div>
        );
    }

    if (filtered.length > 10)
    {
        return(
            <div className="result-container">
                Too many matches, specify another filter
            </div>
        );
    }
    else if (filtered.length === 1)
    {
        return(
            <div className="result-container">
                <Country country={filtered[0]}/>
            </div>
        );
    }
    else
    {
        return (
            <div className="result-container">
                {filtered.map(country => (
                    <p key={country.cca2}> {country.name.common}</p>
                ))}
            </div>
        );
    }
}

export default Result;