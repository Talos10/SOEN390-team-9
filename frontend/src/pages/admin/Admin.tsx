import { Container, Card } from '../../components';
import React, { Component, useEffect } from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, MenuItem, Select, TextField } from '@material-ui/core';
import jwtDecode, { JwtHeader } from 'jwt-decode';
import './Admin.scss'

export default function Admin() {


    interface User {
        userID: number;
        name: string;
        role: string;
        email: string;
    }

    const [accountType, setAccountType] = useState<string>('');

    const onAccountTypeChange = (e: React.ChangeEvent) => {
        const select = e.target as HTMLSelectElement;
        const type = select.value;
        setAccountType(type);
    };

    const changeAccountType = (user:User) => async (e: React.ChangeEvent) => {
        const select = e.target as HTMLSelectElement;
        const type = select.value;
        setAccountType(type);
        

        const request = await fetch("http://localhost:5000/user/"+user.userID, {
            method: 'PUT',
            headers: {
                Authorization: `bearer ${localStorage.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({userID:user.userID, name: user.name, role: type, email:user.email})
        });
        //const response = await request.json();
        window.location.reload(false);
    };

    const accountTypes = [
        {
            value: 'admin',
            label: 'Administrator'
        },
        {
            value: 'employee',
            label: 'Employee'
        }
    ];

    const [users, setUsers] = useState<User[]>([]);

    const getAllUsers = async () => {
        const request = await fetch("http://localhost:5000/user/", {
            method: 'GET',
            headers: { "Authorization": `bearer ${localStorage.getItem("token")}` }
        });
        const response = await request.json();
        const usersData = response as User[];
        setUsers(usersData);

    };

    useEffect(() => {
        getAllUsers();
    }, []);


    const handleAddAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const data = parseForm(form);
        const request = await fetch("http://localhost:5000/user/", {
            method: 'POST',
            headers: {
                Authorization: `bearer ${localStorage.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        const response = await request.json();
        window.location.reload(false);

    }

    const parseForm = (form: HTMLFormElement) => {
        const formData = new FormData(form);
        const type = formData.get('account-type');

        return {
            name: formData.get('account-email')?.toString().split("@")[0],
            email: formData.get('account-email') as string | undefined,
            password: formData.get('password') as string | undefined,
            role: formData.get('account-type')
        };
    };

    const userTokenDecoded:any = jwtDecode((localStorage.getItem("token") as string));

    return (
        <div>
            <Container>
                <div className="Admin">
                    <div className="admin__top">
                        <h1 className="title">Accounts</h1>
                    </div>
                    <Card className="accounts">
                        <table>
                            <thead>
                                <tr>
                                    <td>
                                        <form className="AddAccount" onSubmit={handleAddAccount}>
                                            <tr className="firstRow">
                                                <td><TextField id="account-email" name="account-email" type="email" variant="outlined" placeholder="Email" required fullWidth /></td>
                                                <td><TextField id="password" name="password" type="password" variant="outlined" placeholder="Password" required fullWidth /></td>
                                                <td>
                                                    <TextField
                                                        required
                                                        defaultValue=""
                                                        select
                                                        onChange={onAccountTypeChange}
                                                        id="account-type"
                                                        name="account-type"
                                                        variant="outlined"
                                                        label="Account Type"
                                                        style={{ width: '25em' }}>
                                                        {accountTypes.map(option => (
                                                            <MenuItem key={option.value} value={option.value}>
                                                                {option.label}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </td>
                                                <td>
                                                    <div className="admin__top__buttons">
                                                        <Button color="primary" variant="contained" type="submit">
                                                            Add Account
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        </form>
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(user => {
                                    if (user.name != localStorage.getItem("name"))
                                        return (
                                            <tr key={user.name}>
                                                <td className="name">{user.name}</td>
                                                <td>
                                                    <TextField
                                                        value={user.role}
                                                        defaultValue=""
                                                        select
                                                        onChange={changeAccountType(user)}
                                                        id="account-type"
                                                        name="account-type">
                                                        {accountTypes.map(option => (
                                                            <MenuItem key={option.value} value={option.value}>
                                                                {option.label}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField> 
                                                </td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </Card>
                </div>
            </Container>
        </div>
    );
}



