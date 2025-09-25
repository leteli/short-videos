import { useState, useEffect } from "react";
import { useUnit } from "effector-react";
import { Text, Variants } from "../common/Text/Text";
import { Option, Select } from "../common/Select/Select";
import { Loader } from "../common/Loader/Loader";
import { useDebounce } from "@/hooks/useDebounce";
import {
  searchUsersFx,
  $matchedUsersStore,
  changeQueryEvent,
  loadNextUsersPage,
} from "@/stores";
import { SEARCH_QUERY_MAX } from "@/constants/common";
import { FetchItemshModes } from "@/constants/http";
import styles from "./UsersSearch.module.scss";

interface IProps {
  onSelect: (userId: string) => void;
  selectId?: string;
  setError: (error: string | null) => void;
  error: string | null;
}
const DEFAULT_SELECT_NAME = "users_search";
const SEARCH_DEBOUNCE_MS = 300;

export const UsersSearch = ({ onSelect, selectId, error }: IProps) => {
  const {
    usersStore,
    searchUsers,
    searchUsersPending,
    changeQuery,
    loadNextPage,
  } = useUnit({
    usersStore: $matchedUsersStore,
    searchUsers: searchUsersFx,
    searchUsersPending: searchUsersFx.pending,
    changeQuery: changeQueryEvent,
    loadNextPage: loadNextUsersPage,
  });
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { cancel } = useDebounce(
    () => {
      if (searchQuery.length > SEARCH_QUERY_MAX) {
        console.error("Search query exceeds max word length");
        return;
      }
      changeQuery(searchQuery);
    },
    SEARCH_DEBOUNCE_MS,
    [searchQuery, changeQuery]
  );

  useEffect(() => {
    searchUsers({ mode: FetchItemshModes.replace });
    return () => cancel();
  }, [searchUsers, cancel]);

  return (
    <div className={styles.container}>
      <Select
        id={selectId ?? DEFAULT_SELECT_NAME}
        options={usersStore.users.map(({ id, username }) => ({
          value: id,
          label: username,
        }))}
        labelText="Add participants"
        isLoading={searchUsersPending}
        onInputChange={(value) => setSearchQuery(value)}
        onChange={(option) => {
          const typedOption = option as Option;
          if (typedOption?.label && typedOption?.value) {
            onSelect(typedOption.value);
          }
        }}
        onMenuScrollToBottom={() => {
          if (!searchUsersPending && usersStore.hasMore) {
            loadNextPage();
          }
        }}
        noOptionsMessage={() => {
          if (searchUsersPending) {
            return (
              <div className={styles.loaderWrapper}>
                <Loader />
              </div>
            );
          }
          return <Text>No users found</Text>;
        }}
        placeholder="Search by username"
        closeMenuOnSelect
        blurInputOnSelect
        filterOption={null}
        withError={!!error}
      />
      {error && (
        <Text variant={Variants.caption} className={styles.errorText}>
          {error}
        </Text>
      )}
    </div>
  );
};
