"use client";

import {useEntitySearch} from "@/hooks/use-entity-search";
import {EntitySearch} from "@/components/entity-components";

import {useTopicsParams} from "../hooks/use-topics-params";

const TopicsSearch = () => {
  const [params, setParams] = useTopicsParams();

  const {searchValue, onSearchChange} = useEntitySearch({
    params,
    setParams,
  });

  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search topics"
    />
  );
};

export default TopicsSearch;
