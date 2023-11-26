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
    const [searchFilters, setSearchFilters] = useState(true);
    const router = useRouter();
    const path = router.pathname;

    const { query } = router;

    return (
        <Box>
            <Box h={"70vh"} bgImage={`url(https://firebasestorage.googleapis.com/v0/b/houseed-50461.appspot.com/o/misc%2FReal-Estate-Investment-Firm-1170x780.jpg?alt=media&token=3bf05a44-1be6-4a6f-8720-a7fdfe8f9173&_gl=1*13udk21*_ga*MTg1OTY1Nzk1OC4xNjkwNTUwODA0*_ga_CW55HF8NVT*MTY5NjA1NzM1Ny4xMy4xLjE2OTYwNTc0MTQuMy4wLjA.)`} bgPosition={"center"} objectFit={"cover"} bgRepeat={"no-repeat"} borderRadius={"10px"} display={"flex"} justifyContent={"center"} alignItems={"center"}>
                <Box>
                    <Flex flexDirection={"column"} justifyContent={"center"} alignItems={"center"}>
                        <Box fontSize={"4xl"} fontWeight={"bold"} color={"white"} textShadow="2px 2px 4px rgba(0, 0, 0, 0.7)">Find your next home</Box>
                        <Box maxW={["100%", "50%"]} mt={"2%"}>
                            <Box bg={"blackAlpha.500"} borderRadius={"10px"}>
                                {searchFilters && <SearchFilters setSearchFilters={setSearchFilters} backgroundColor={"blackAlpha.300"} borderRadius={"10px"}/>}
                            </Box>
                        </Box>

                    </Flex>

                </Box>

            </Box>

        </Box>
    );
};

export default HomepageV2;
