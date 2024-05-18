import { useState } from "react";

const useSearch = (initialValue = "") => {
  const [searchValue, setSearchValue] = useState(initialValue);

  return [searchValue, setSearchValue];
};

export default useSearch;
