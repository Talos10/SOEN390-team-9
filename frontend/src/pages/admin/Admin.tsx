import { Container } from '../../components';
import React, { Component, useEffect } from 'react';
import {useState} from 'react';

export default function Admin() {

    const [users,setUsers] = useState<any[]>();

    const getAllUsers = () => {

        console.log(localStorage.getItem("token"));
    
        const request = fetch("http://localhost:5000/user/", {
            method: 'GET',
            headers: { "Authorization": `bearer ${localStorage.getItem("token")}` },
        }).then(response => response.json())
        .then(response => {
            setUsers(response)
        })
    
    }

    useEffect(() => getAllUsers(), []);


    return (
        <div>
        <Container>
            <div>
                Welcome Admin {localStorage.getItem("name")}.
            </div>

            
        </Container>
    </div>
    );
  }



