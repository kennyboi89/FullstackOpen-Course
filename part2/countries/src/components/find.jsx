const Find = ( {handleKeywordChange}) => {
    return (
        <div className="find-container">
            <form>
                <label>Find countries </label>
                <input
                    onChange={handleKeywordChange}
                />
            </form>   
        </div>
       
    );
}

export default Find;