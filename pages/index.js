import Link from 'next/link';
import Image from 'next/image';
import {Flex, Box, Text, Button, Icon} from '@chakra-ui/react';
import {baseUrl, fetchApi} from "../utils/fetchApi";
import Property from '../components/Property'
import {BsFilter} from "react-icons/bs";
import {ImPlus} from "react-icons/im";
import SearchFilters from "../components/SearchFilters";
import noresult from "../assets/images/noresult.svg";
import React, {useState} from "react";
import NewHouse from "../components/NewHouse";

const Banner = ({purpose, title1, title2, desc1,desc2, buttonText, linkName, imageUrl}) => (
    <Flex flexWrap="wrap" justifyContent="center" alignItems="center" m="10">
        <Image src={imageUrl} width={500} height={300} alt="banner"/>
        <Box p="5">
            <Text color="gray.500" fontSize="sm" fontWeight="medium" >{purpose}</Text>
            <Text fontSize="3xl" fontWeight="bold" >{title1}<br/> {title2}</Text>
            <Text fontSize="lg" paddingTop="3" paddingBottom="3" color="gray.700">{desc1} <br/>{desc2}</Text>
            <Button fontSize="xl">
                <Link href={linkName}>{buttonText}</Link>
            </Button>
        </Box>

    </Flex>
)

export default function Home({ propertiesForSale, propertiesForRent }) {
    //console.log(propertiesForRent, propertiesForSale)
    const [newHouse, setNewHouse] = useState(false)
  return (
      <>
          <Box>
              <Flex cursor="pointer" bg="gray.100" borderBottom="1px" borderColor="gray.200" p="2" fontWeight="black" fontSize="lg" justifyContent="center" alignItems="center" onClick={() => setNewHouse((prevHouse) => !prevHouse)}>
                  <Text>Add a new property</Text>
                  <Icon paddingLeft="2" w="7" as={ImPlus}></Icon>
              </Flex>
              {newHouse && <NewHouse/>}

          </Box>
          <Box>
              <Banner
                  purpose="RENT A HOME"
                  title1="Rental Homes for"
                  title2="Everyone"
                  desc1="Explore Apartments, Villas, Homes"
                  desc2="and more"
                  buttonText="Explore Renting"
                  linkName="/search?purpose=for-rent"
                  imageUrl="https://images.bayut.com/thumbnails/296195424-800x600.webp"
              />
              <Flex flexWrap="wrap">
                  {/*Fetching Data from the database*/}
                  {propertiesForRent.map((property) => <Property property={property} key={property.id}/>)}

              </Flex>

              <Banner
                  purpose="Buy A HOME"
                  title1="Find, Buy & Own Your"
                  title2="Home"
                  desc1="Explore Apartments, Villas, Homes"
                  desc2="and more"
                  buttonText="Explore Buying"
                  linkName="/search?purpose=for-sale"
                  imageUrl="https://images.bayut.com/thumbnails/294251565-800x600.webp"
              />

              <Flex flexWrap="wrap">
                  {/*Fetching Data from the database*/}
                  {propertiesForSale.map((property) => <Property property={property} key={property.id}/>)}
              </Flex>
          </Box>
      </>

  )
}

export async function getStaticProps(){
    const propertyForSale = await fetchApi(`${baseUrl}/properties/list?locationExternalIDs=5002&purpose=for-sale&hitsPerPage=6`)
    const propertyForRent = await fetchApi(`${baseUrl}/properties/list?locationExternalIDs=5002&purpose=for-rent&hitsPerPage=6`)


    return {
        props:{
            propertiesForSale: propertyForSale?.hits,
            propertiesForRent: propertyForRent?.hits,
        }
    }
}
