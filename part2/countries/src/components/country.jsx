import Weather from "./weather";

const Country = ({country}) => {
    return (
        <div className="country-container">
            <h2>{country.name.common}</h2>
            Capital: {country.capital[0]}
            <br></br>
            Area: {country.area}
            <h3>Languages</h3>
            <ul>
                {Object.keys(country.languages).map((code) => (
                    <li key={code}>{country.languages[code]}</li>
                ))}
            </ul>
            <img src={country.flags.png} alt="Flag" />
            <Weather capital={country.capital[0]}/>
        </div>
    );
}

export default Country