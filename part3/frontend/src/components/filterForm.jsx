const FilterForm = ({handleFilterChange, newFilter}) => {
    return (
        <div>
          filter shown with 
          <input value={newFilter}
          onChange={handleFilterChange}/>
        </div>
    );
};

export default FilterForm;