const PhoneForm = ({addPerson, name, handleNameChange, newNumber, handleNumberChange}) => {
    return (
        <div className="phone-form">
            <h2>Add a new</h2>
        <form onSubmit={addPerson}>
          <div>
            name: 
            <input value={name}
            onChange={handleNameChange}/>
          </div>
          <div>number: 
            <input value={newNumber}
              onChange={handleNumberChange}
            />
          </div>
          <div>
            <button type="submit">add</button>
          </div>
        </form>
        </div>

      
    )
}

export default PhoneForm;