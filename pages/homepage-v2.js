import React, {useState} from 'react';
import {Box, Flex, Icon, Tab, TabList, TabPanel, TabPanels, Tabs, Text} from "@chakra-ui/react";
import {BsFilter} from "react-icons/bs";
import SearchFilters from "../components/SearchFilters";
import Property from "../components/Property";
import Image from "next/image";
import noresult from "../assets/images/noresult.svg";
import {filterData, getFilterValues} from "../utils/filterData";
import {useRouter} from "next/router";
import searchFilters from "../components/SearchFilters";

const HomepageV2 = () => {
    const [filters, setFilters] = useState(filterData);
    const router = useRouter();
    const path = router.pathname;
    const { query } = router;
    const searchProperties = (filterValues) => {
        const path = router.pathname;

        const { query } = router;


        const values = getFilterValues(filterValues);

        values.forEach((item) => {
            if (item.value && filterValues?.[item.name]){
                query[item.name] = item.value

            }

        })

        router.push({pathname: path, query})

    }

    return (
        <Box>
            <Box h={"70vh"} bgImage={`url(https://www.bayut.com/assets/imageBackgroundLarge.99b0fdaa4e2448fbddf40424337357ac.jpg)`} bgPosition={"center"} borderRadius={"10px"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                <Box>
                    <Flex flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
                        <Box fontSize={"4xl"} fontWeight={"bold"} color={"white"} textShadow="2px 2px 4px rgba(0, 0, 0, 0.7)">Find your next home</Box>
                        <Box maxW={"50%"} mt={"2%"}>
                            <Box bg={"blackAlpha.500"} borderRadius={"10px"}>
                                <SearchFilters backgroundColor={"blackAlpha.300"} borderRadius={"10px"}/>
                            </Box>
                        </Box>

                    </Flex>

                </Box>

            </Box>

        </Box>
    );
};

export default HomepageV2;
