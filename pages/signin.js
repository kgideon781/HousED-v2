import React, { useState } from "react";
import {auth, db} from "../firebase";
import {
    FormControl,
    Input,
    Button,
    Box,
    useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import firebase from "firebase";

const Signin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const toast = useToast();
    const router = useRouter();

    // Function to handle sign-in
    const handleSignIn = async () => {
        try {
            await auth.signInWithEmailAndPassword(email, password);
            router.push("/");
        } catch (error) {
            setError(error.message);
        }
    };

    // Function to handle sign-up
    const handleSignUp = async () => {
        try {
            await auth.createUserWithEmailAndPassword(email, password).then((user) => {
                    db.collection("users").doc(user.user.uid).set({
                        email: email,
                        role: "subscriber",
                        uid: user.user.uid,
                        displayName: user.user.displayName,
                        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
                    });
                }

            );
            router.push("/");
        } catch (error) {
            setError(error.message);
        }
    };
    // Function to handle sign up with Google
    const handleGoogleSignUp = async () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        try {
            await auth.signInWithPopup(provider).then((result) => {
                db.collection("users").doc(result.user.uid).set({
                    email: result.user.email,
                    role: "subscriber",
                    uid: result.user.uid,
                    photoURL: result.user.photoURL,
                    displayName: result.user.displayName,
                    lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
                });
            });

            router.push("/");
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <Box
            borderWidth="1px"
            rounded="lg"
            shadow="1px 1px 3px rgba(0,0,0,0.3)"
            maxWidth={800}
            p={6}
            m="10px auto"
            as="form"
        >
            <FormControl mr="5%" mt="2%">
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
            <Box display={"flex"} flexDir={"column"}>
                <Button mt="2%" colorScheme="teal" onClick={handleSignIn}>
                    Sign In
                </Button>
                <Button mt="2%" colorScheme="teal" onClick={handleSignUp}>
                    Sign Up
                </Button>
                {/* Remove handleSignUp from the button */}
                <Button colorScheme="red" mt="2%" onClick={handleGoogleSignUp}>
                    Sign in with Google
                </Button>
                {error && <p>{error}</p>}
            </Box>

        </Box>
    );
};

export default Signin;
