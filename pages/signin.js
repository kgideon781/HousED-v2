import React, { useState } from "react";
import {auth, db} from "../firebase";
import firebase from 'firebase/app';
import {FormControl, Input, Button, Flex, GridItem, Box, useToast} from "@chakra-ui/react";
import { GoogleLogin } from 'react-google-login';
import {useRouter} from "next/router";

const Signin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const toast = useToast();
    const router = useRouter();
    //check if user is logged in already and redirect them to the homepage
    auth.onAuthStateChanged((user) => {
        if (user) {
            router.push('/');
        }
    });


    const onSuccess = (response) => {
        const googleCredential = auth.GoogleAuthProvider.credential(response.tokenId);
        auth.signInWithCredential(googleCredential).then(r => console.log(`logged in as ${r.user.uid}`));
    }

    const onFailure = (error) => {
        console.log(error);
    }


    const handleSignUp = async () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        try {
            const { user } = await auth.signInWithPopup(provider);
            // Save user data to your database
            // Redirect to the homepage or another page
            console.log(user)
            db.collection("users").doc(user.uid).set({
                displayName: user.displayName,
                email: user.email,
                uid: user.uid,
                role: "subscriber"
                //photoUrl: user.photoUrl
            }).then(r =>{
                toast({
                    title: `user ${user.displayName} created!`,
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                });
            })

            await router.push('/');
        }
        catch (error) {
            console.error(error);
        }
        /*auth
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
                toast({
                    title: "user created!",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                });
            })
            .catch((error) => {
                setError(error.message);
                toast({
                    title: "An error occurred! User could not be created",
                    description: error.message,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
            });*/
    };

    const handleSignIn = async () => {
        auth
            .signInWithEmailAndPassword(email, password)
            .then(() => {
                console.log("user signed in!");
                toast({
                    title: "Login successful.",
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                });
            })
            .catch((error) => {
                setError(error.message);
                toast({
                    title: "Email or password is incorrect! Please confirm and try again.",
                    description: error.message,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                });
            });
    };

    return (
        <Box
            borderWidth="1px"
            rounded="lg"
            shadow="1px 1px 3px rgba(0,0,0,0.3)"
            maxWidth={800}
            p={6}
            m="10px auto"
            as="form">

            <FormControl mr="5%" mt="2%" as={GridItem} colSpan={[6, 3]}>
                <Input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl mt="2%">
                <Input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </FormControl>
            <Flex flexDirection={"column"} >
                <Button mt="2%" variantColor="teal" onClick={handleSignIn}>
                    Sign In
                </Button>
                <Button mt="2%" variantColor="teal" onClick={handleSignUp}>
                    Sign Up
                </Button>
                <Button
                    colorScheme={"red"}
                    clientId="289236507834-2j0hu3sfmckncpdvaduelcdordhur2rb.apps.googleusercontent.com"
                    onClick={handleSignUp}
                    mt="2%"
                >Sign in with Google</Button>
            </Flex>

            {error && <p>{error}</p>}
        </Box>
    );
};

export default Signin;
