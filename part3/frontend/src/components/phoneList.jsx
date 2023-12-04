const PhoneList = ({persons, onClickDelete}) => {
    return (
        <div className="phone-list">
            <h2>Numbers</h2>
      
            {persons.map(person =>
                <li key={person.id}> 
                    {person.name} {person.number} 
                    <button onClick={() => onClickDelete(person)}>Delete</button>
                </li> 
            )}



        </div>
    )
};

export default PhoneList;