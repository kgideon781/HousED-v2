import {Box, Button, Flex, Select} from "@chakra-ui/react";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {filterData, getFilterValues} from "../utils/filterData";

const SearchFilters = ({backgroundColor, borderRadius, setSearchFilters}) => {
    const [filters, setFilters] = useState(filterData);
    const router = useRouter();
    const path = router.pathname;
    const { query } = router;

    useEffect(() => {
        // When the component mounts, update the 'select' elements' value based on the query parameters
        filters.forEach((filter) => {
            const value = query[filter.queryName];
            if (value) {
                setFilters((prevFilters) => {
                    return prevFilters.map((f) => {
                        if (f.queryName === filter.queryName) {
                            return {...f, selectedValue: value};
                        }
                        return f;
                    });
                });
            }
        });
    }, [query]);

    const searchProperties = (filterValues) => {

        const { query } = router;


        const values = getFilterValues(filterValues);

        values.forEach((item) => {
            if (item.value && filterValues?.[item.name]){
                query[item.name] = item.value

            }

        })


        router.push({pathname: "/search", query})

    }
    const clearFilters = () => {
        // Reset selectedValue of each filter to undefined
        setFilters((prevFilters) =>
            prevFilters.map((f) => ({ ...f, selectedValue: undefined }))
        );

        router.replace('/search', undefined, { shallow: true });
    }



    return(
        <Flex bg={backgroundColor} p="4" justifyContent="center" flexWrap="wrap" borderRadius={borderRadius}>
            {filters.map((filter) => (
                <Box key={filter.queryName}>
                    <Select
                        placeholder={filter.placeholder}
                        w="fit-content"
                        p="2"
                        backgroundColor={"white"}
                        onChange={(e) => searchProperties({[filter.queryName]: e.target.value})}>
                        <option value="" hidden>
                            {filter.placeholder}
                        </option>
                        {filter?.items?.map((item) => (
                            <option value={item.value} key={item.value}>
                                {item.name}
                            </option>
                        ))}
                    </Select>
                </Box>
            ))}
            <Button color="red.400" top="2" p="4" onClick={() => {
                clearFilters()
                setSearchFilters(false);
            }
            }>Clear Filters</Button>

        </Flex>
    )
}
export default SearchFilters;
