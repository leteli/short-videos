import { useState, useEffect } from "react";
import { useUnit } from "effector-react";
import { Options } from 'react-select';
import { Text, Variants } from "../common/Text/Text";
import { Option, Select } from "../common/Select/Select";
import { useDebounce } from "@/hooks/useDebounce";
import { searchUsersFx } from "@/stores";
import { PAGE_DEFAULT, USERNAME_MIN } from "@/constants/common";
import styles from "./UsersSearch.module.scss";

interface IProps {
  onSelect: (userId: string) => void;
  selectId?: string;
  setError: (error: string | null) => void;
  error: string | null;
}
const DEFAULT_SELECT_NAME = "users_search";

export const UsersSearch = ({ onSelect, selectId, error }: IProps) => {
  const [options, setOptions] = useState<Options<{ value: string, label: string }>>([]);
  const { searchUsers, searchUsersPending } = useUnit({
    searchUsers: searchUsersFx,
    searchUsersPending: searchUsersFx.pending,
  });
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [page, setPage] = useState(PAGE_DEFAULT);

  const loadUsers = async (searchQuery?: string) => {
  if (typeof searchQuery == 'string' && (!searchQuery?.trim() || searchQuery?.trim().length < USERNAME_MIN)) {
    return [];
  }
  try {
    const result = await searchUsers({ ...(searchQuery && { searchQuery }), page });
    const userOptions = result.users.map(({ id, username }) => ({ value: id, label: username }));
    setOptions(userOptions);
  } catch (err) {
    console.error(err);
    return [];
  }
  };
  
  const { cancel } = useDebounce(
    () => loadUsers(searchQuery),
    300,
    [searchQuery, page]
  );

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    return () => cancel();
  }, [])

  return (
    <div className={styles.container}>
      <Select
        id={selectId ?? DEFAULT_SELECT_NAME}
        options={options}
        defaultValue={options[0]}
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
        if (!searchUsersPending) {
          setPage((page) => page + 1);
        }
        }}
        placeholder="Search by username"
        closeMenuOnSelect
        blurInputOnSelect
        noOptionsMessage={() => <Text>No users found</Text>}
        withError={!!error}
      />
      {error && <Text variant={Variants.caption} className={styles.errorText}>{error}</Text>}
      </div>
  );
};
