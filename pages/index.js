import Link from 'next/link';
import Image from 'next/image';
import {Flex, Box, Text, Button, Icon} from '@chakra-ui/react';
import Property from '../components/Property'
import {ImPlus} from "react-icons/im";
import React, {useState} from "react";
import {useCollection} from "react-firebase-hooks/firestore";
import {db} from "../firebase";

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
export const addLike = (propertyID) => {
    console.log(propertyID)
}

function Home(){

    const [newHouse, setNewHouse] = useState(false)
    const [properties] = useCollection(db.collection("properties"))
    const [propertiesForRent] = useCollection(
        db.collection("properties")
            .where("purpose", "==", "for-rent")
    )
    const [propertiesForSale] = useCollection(
        db.collection("properties")
            .where("purpose", "==", "for-sale")
    )


  return (
      <>
          <Box>
              <Flex cursor="pointer" bg="gray.100" borderBottom="1px" borderColor="gray.200" p="2" fontWeight="black" fontSize="lg" justifyContent="center" alignItems="center" onClick={() => setNewHouse((prevHouse) => !prevHouse)}>
                  <Text>Add a new property</Text>
                  <Icon paddingLeft="2" w="7" as={ImPlus}></Icon>
              </Flex>


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
                  {/* Fetching Data from the database
                  {propertiesForRent.map((property) => <Property property={property} key={property.id}/>)}*/}
                  {propertiesForRent?.docs.map((property) => (


                      <Property
                          key={property.id}
                          propertyID={property.id}
                          coverPhoto={property.data().coverPhoto}
                          price={property.data().price}
                          rentFrequency={property.data().rentFrequency}
                          rooms={property.data().rooms}
                          title={property.data().title}
                          baths={property.data().baths}
                          area={property.data().area}
                          agency={property.data().agency}
                          isVerified={property.data().isVerified}
                          externalID={property.data().externalID}
                      />
                  ))}

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

                  {propertiesForSale?.docs.map((property) => (


                      <Property
                          key={property.id}
                          propertyID={property.id}
                          coverPhoto={property.data().coverPhoto}
                          price={property.data().price}
                          rentFrequency={property.data().rentFrequency}
                          rooms={property.data().rooms}
                          title={property.data().title}
                          baths={property.data().baths}
                          area={property.data().area}
                          agency={property.data().agency}
                          isVerified={property.data().isVerified}
                          externalID={property.data().externalID}
                      />
                  ))}

              </Flex>
          </Box>
      </>

  )
}
export default Home;