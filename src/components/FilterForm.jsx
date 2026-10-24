function FilterForm({ value, onChange }) {
  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <input
        type="text"
        placeholder="Filter posts by title"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </form>
  );
}

export default FilterForm;
