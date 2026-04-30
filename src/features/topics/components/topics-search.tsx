"use client";

import {useEntitySearch} from "@/hooks/use-entity-search";
import {EntitySearch} from "@/components/entity-components";

import {useTopicsParams} from "../hooks/use-topics-params";

interface TopicsSearchProps {
  placeholder: string;
}

const TopicsSearch = ({placeholder}: TopicsSearchProps) => {
  const [params, setParams] = useTopicsParams();

  const {searchValue, onSearchChange} = useEntitySearch({
    params,
    setParams,
  });

  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder={placeholder}
    />
  );
};

export default TopicsSearch;
