import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import Image from 'next/image';
import {Flex, Box, Text, Icon} from "@chakra-ui/react";
import {BsFilter} from "react-icons/bs";

import React from 'react';
import SearchFilters from "../components/SearchFilters";
import Property from "../components/Property";
import noresult from "../assets/images/noresult.svg"
import {useCollection} from "react-firebase-hooks/firestore";
import {db} from "../firebase";
import {fetchApi} from "../utils/fetchApi";
import {useLocation, useNavigate, useParams} from "react-router";
import {error} from "next/dist/build/output/log";
import property from "../components/Property";


function Search (){

    const [searchFilters, setSearchFilters] = useState(false);
    const router = useRouter();
    const [realProps] = useCollection(db.collection("properties"))
    const [qryResults, setQryResults] = useState([])
    const qryArray = []
    const qryArrayResult = []

    const filterQuery = router.query;

    realProps?.docs.map(property => {
        let obj = {
            docId: property.id,
            ...property.data()
        }
        qryArray.push(obj)
    })


    const [purposeFilter, setPurposeFilter] = useState();
    const [rentFQFilter, setRentFQFilter] = useState();
    const purpose = filterQuery.purpose
    const rentFrequency = filterQuery.rentFrequency
    const minPrice = filterQuery.minPrice
    const maxPrice = filterQuery.maxPrice
    const areaMax = filterQuery.areaMax
    const roomsMin = filterQuery.roomsMin
    const baths = filterQuery.bathsMin
    const furnishType = filterQuery.furnishType
    const propertyType = filterQuery.propertyType
    const sort = filterQuery.sort



    useEffect(() => {


        //if (filterQuery) console.log("present")



    }, [filterQuery])

    const filtered = qryArray.filter(qry => {
        if (purpose && rentFrequency && roomsMin && minPrice && baths && areaMax && maxPrice) {

            return qry.purpose === purpose &&
                qry.rentFrequency === rentFrequency &&
                qry.rooms === +roomsMin &&
                qry.price >= +minPrice &&
                qry.baths <= +baths &&
                qry.area <= +areaMax &&
                qry.price <= +maxPrice

        }
        else if (purpose && rentFrequency && roomsMin && minPrice && baths && maxPrice) {

            return qry.purpose === purpose &&
                qry.rentFrequency === rentFrequency &&
                qry.rooms === +roomsMin &&
                qry.price >= +minPrice &&
                qry.baths <= +baths &&
                qry.price <= +maxPrice
        }
        else if (purpose && rentFrequency && roomsMin && minPrice && maxPrice) {

            return qry.purpose === purpose &&
                qry.rentFrequency === rentFrequency &&
                qry.rooms === +roomsMin &&
                qry.price >= +minPrice &&
                qry.price <= +maxPrice
        }
        else if (rentFrequency && roomsMin && minPrice && maxPrice) {

            return qry.rentFrequency === rentFrequency &&
                qry.rooms === +roomsMin &&
                qry.price >= +minPrice &&
                qry.price <= +maxPrice
        }
        else if (purpose && rentFrequency && minPrice && maxPrice){
            return qry.purpose === purpose &&
                qry.rentFrequency === rentFrequency &&
                qry.price >= +minPrice &&
                qry.price <= +maxPrice
        }
        else if (purpose && rentFrequency && roomsMin && baths) {

            return qry.purpose === purpose &&
                qry.rentFrequency === rentFrequency &&
                qry.rooms <= +roomsMin &&
                qry.baths === +baths
        }
        else if (purpose && rentFrequency && roomsMin) {

            return qry.purpose === purpose &&
                qry.rentFrequency === rentFrequency &&
                qry.rooms <= +roomsMin
        }


        else if (purpose && rentFrequency && roomsMin) {
            return qry.purpose === purpose &&
                qry.rentFrequency === rentFrequency &&
                qry.rooms <= +roomsMin
        } else if (purpose && rentFrequency) {
            //console.log("Mbadala")
            return qry.purpose === purpose && qry.rentFrequency === rentFrequency
        }
        else if (minPrice && maxPrice && rentFrequency){
            return qry.price >= +minPrice &&
                qry.price <= +maxPrice &&
                qry.rentFrequency === rentFrequency
        }
        else if (minPrice && maxPrice){
            return qry.price >= +minPrice &&
                qry.price <= +maxPrice
        }
        else if (purpose) {
            return qry.purpose === purpose
        } else if (rentFrequency) {
            return qry.rentFrequency === rentFrequency
        }
        else if (minPrice){
            return qry.price >= +minPrice
        }
        else if (maxPrice){
            return qry.price <= +maxPrice
        }
        else if (roomsMin){
            return qry.rooms >= +roomsMin
        }
        else if (baths){
            return qry.baths <= +baths
        }
        else if (areaMax){
            return qry.area <= +areaMax
        }
        else{
            return qry
        }

    });


    //console.log(filtered)

    return(

        <Box>
            <Flex cursor="pointer" bg="gray.100" borderBottom="1px" borderColor="gray.200" p="2" fontWeight="black" fontSize="lg" justifyContent="center" alignItems="center" onClick={() => setSearchFilters((prevFilters) => !prevFilters)}>
                <Text>Search Property By Filters</Text>
                <Icon paddingLeft="2" w="7" as={BsFilter}></Icon>
            </Flex>

            {searchFilters && <SearchFilters/>}
            <Text fontSize="2xl" p="4" fontWeight="bold">
                Properties {router.query.purpose}

            </Text>
            <Flex flexWrap="wrap">
                {filtered.map((property) => <Property
                    key={property.docId}
                    propertyID={property.docId}
                    coverPhoto={property.coverPhoto}
                    price={property.price}
                    rentFrequency={property.rentFrequency}
                    rooms={property.rooms}
                    title={property.title}
                    baths={property.baths}
                    area={property.area}
                    agency={property.agency}
                    isVerified={property.isVerified}
                    externalID={property.externalID}
                    />
                )}
            </Flex>
            {filtered.length === 0 && (
                <Flex justifyContent="center" alignItems="center" flexDirection="column" marginTop="5" marginBottom="5">
                    <Image src={noresult}  alt="no result"/>
                    <Text fontSize="2xl" marginTop="3">No Results Found</Text>
                </Flex>
            )}
        </Box>
        )

}


export default Search;
