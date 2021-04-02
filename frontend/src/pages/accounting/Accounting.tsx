import { Line, Pie } from 'react-chartjs-2';

import './Accounting.scss';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import goldMedal from '../../assets/accounting/gold-medal.png';
import silverMedal from '../../assets/accounting/silver-medal.png';
import bronzeMedal from '../../assets/accounting/bronze-medal.png';
import { useEffect, useState } from 'react';
import { useBackend } from '../../contexts';
import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

interface Client {
    customerId: number;
    name: string;
    email: string;
    totalSpent: number;
    numOrders: number;
  }

export default function Accounting() {
     const [income, setIncome] = useState<number>();
     const [monthlyIncome, setMonthlyIncome] = useState<number[]>([]);
     const [expense, setExpense] = useState<number>();
     const [monthlyExpense, setMonthlyExpense] = useState<number[]>([]);
     const [topClients, setTopClients] = useState<Client[]>([]);
     const { accounting } = useBackend();


     useEffect(() => {
        const getIncome = async () => {
            const income = await accounting.getIncome();
            setIncome(income);
        }
   
        const getExpense = async () => {
            const expense = await accounting.getExpense();
            setExpense(expense);
        }
   
        const getMonthlyIncome = async () => {
           const monthlyIncome = await accounting.getIncomePerMonth();
       
           if (Array.isArray(monthlyIncome)) {
               setMonthlyIncome(monthlyIncome);
           }
         };
   
         const getMonthlyExpense = async () => {
           const monthlyExpense = await accounting.getExpensePerMonth();
       
           if (Array.isArray(monthlyExpense)) {
               setMonthlyExpense(monthlyExpense);
           }
         };
   
         const getTopClients = async () => {
             const topClients = await accounting.getTop3Customers();
   
             if(Array.isArray(topClients)) {
                 setTopClients(topClients);
             }
         }
         getIncome();
         getExpense();
         getMonthlyIncome();
         getMonthlyExpense();
         getTopClients();
       }, []);


return (
    <main className="Accouting">
        <div className='accounting__top'>
            <h1 className='title'>Overview</h1>
        </div>
        <div className='overview__card'>
            <hr className='line line__income'></hr>
            <h2 className='income__title'>Income</h2>
            <p>${income}</p>
        </div>
        <div className='overview__card'>
            <hr className='line line__expense'></hr>
            <h2 className='expense__title'>Expenses</h2>
            <p>${expense}</p>
        </div>
        <div className='overview__card'>
            <hr className='line line__gross__revenue'></hr>
            <h2 className='gross__revenue__title'>Gross Revenue</h2>
            <p>{income === undefined || expense === undefined ? null : (income-expense).toFixed(2)}</p>
        </div>
        <div className='accounting__top'>
            <h1 className='title'>Chart</h1>
        </div>
        <div>
            <Line
                data={{
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                    datasets: [
                        {
                            label: 'Income',
                            data: monthlyIncome,
                            borderColor: [
                                'rgba(65, 105, 225, 0.5)',
                            ],
                            fill: false,
                            lineTension: 0,
                        },
                        {
                            label: 'Expense',
                            data: monthlyExpense,
                            borderColor: [
                                'rgba(255, 99, 132, 0.5)',
                            ],
                            lineTension: 0,
                            fill: false,
                        }
                    ],
                }}
                height={400}
                width={600}
                options={{
                    maintainAspectRatio: false,
                    responsive: true,
                }}
            />
        </div>
        <div className='accounting__top'>
            <h1 className='title'>Income vs Expense</h1>
        </div>
        <div>
            <Pie 
                data={{
                    datasets: [
                        {
                            labels: [
                                'Income',
                                'Expense'
                            ],
                            data: [1,2],
                            backgroundColor: [
                                'rgba(65, 105, 225, 0.5)',
                                'rgba(255, 99, 132, 0.5)',
                            ]
                        }
                    ]
                }}
                height={400}
                width={600}
                options={{
                    maintainAspectRatio: false,
                }}
            />
        </div>
        <div className='accounting__top'>
            <h1 className='title'>Top 3 clients</h1>
        </div>
        {topClients
            .map(client => (
                <Card className='customer__card' key={client.customerId}> 
                    <CardContent>
                        <div className="thumbnail">
                            <img src={goldMedal} alt='gold medal' />
                        </div>
                        <div className="content">
                            <h3 className="card__title">{client.name}</h3>
                            <p className='email'>{client.email}</p>
                            <p>Revenue: {client.totalSpent}</p>
                            <p>Number of Orders: {client.numOrders}</p>
                        </div>
                    </CardContent>
            </Card>
            ))}
    </main>
  );
}