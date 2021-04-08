import { Line, Pie } from 'react-chartjs-2';

import './Accounting.scss';
import { Card, CardContent, Button } from '@material-ui/core';
import goldMedal from '../../assets/accounting/gold-medal.png';
import silverMedal from '../../assets/accounting/silver-medal.png';
import bronzeMedal from '../../assets/accounting/bronze-medal.png';
import { useEffect, useState } from 'react';
import { useBackend } from '../../contexts';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

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

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  const [x_axis, setX_axis] = useState<string[]>(months);
  const [quarterlyIncome, setQuartelyIncome] = useState<number[]>([]);
  const [quarterlyExpense, setQuartelyExpense] = useState<number[]>([]);
  const [chartDisplay, setChartDisplay] = useState<string>('month');

  const calculateQuartelyIncome = () => {
    const quarterlyIncome = [];
    let quarterIncome = 0;
    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      quarterIncome += monthlyIncome[monthIndex];
      if (monthIndex === 2 || monthIndex === 5 || monthIndex === 8 || monthIndex === 11) {
        quarterlyIncome.push(quarterIncome);
        quarterIncome = 0;
      }
    }
    setQuartelyIncome(quarterlyIncome);
  };

  const calculateQuartelyExpense = () => {
    const quarterlyExpense = [];
    let quarterExpense = 0;
    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      quarterExpense += monthlyExpense[monthIndex];
      if (monthIndex === 2 || monthIndex === 5 || monthIndex === 8 || monthIndex === 11) {
        quarterlyExpense.push(quarterExpense);
        quarterExpense = 0;
      }
    }
    setQuartelyExpense(quarterlyExpense);
  };

  useEffect(() => {
    const getIncome = async () => {
      const income = await accounting.getIncome();
      setIncome(income);
    };

    const getExpense = async () => {
      const expense = await accounting.getExpense();
      setExpense(expense);
    };

    const getMonthlyIncome = async () => {
      const monthlyIncome = await accounting.getIncomePerMonth();

      if (Array.isArray(monthlyIncome)) {
        setMonthlyIncome(monthlyIncome);
        calculateQuartelyIncome();
      }
    };

    const getMonthlyExpense = async () => {
      const monthlyExpense = await accounting.getExpensePerMonth();

      if (Array.isArray(monthlyExpense)) {
        setMonthlyExpense(monthlyExpense);
        calculateQuartelyExpense();
      }
    };

    const getTopClients = async () => {
      const topClients = await accounting.getTop3Customers();

      if (Array.isArray(topClients)) {
        setTopClients(topClients);
      }
    };
    getIncome();
    getExpense();
    getMonthlyIncome();
    getMonthlyExpense();
    getTopClients();
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    chartDisplay === 'month' ? setX_axis(months) : setX_axis(quarters);
    //eslint-disable-next-line
  }, [chartDisplay]);

  return (
    <main className="Accouting">
      <div className="accounting__top">
        <h1 className="title">Overview</h1>
        <Button variant="contained" color="primary" onClick={window.print}>
          Print
        </Button>
      </div>
      <div className="overview__card">
        <hr className="line line__income"></hr>
        <h2 className="income__title">Income</h2>
        <p>${income === undefined ? null : income.toLocaleString()}</p>
      </div>
      <div className="overview__card">
        <hr className="line line__expense"></hr>
        <h2 className="expense__title">Expense</h2>
        <p>${expense === undefined ? null : expense.toLocaleString()}</p>
      </div>
      <div className="overview__card">
        <hr className="line line__gross__revenue"></hr>
        <h2 className="gross__revenue__title">Gross Revenue</h2>
        <p>
          {income === undefined || expense === undefined
            ? null
            : '$' + (income - expense).toLocaleString()}
        </p>
      </div>
      <div className="accounting__top">
        <h1 className="title">Chart</h1>
      </div>
      <div className="line__chart">
        <FormControl component="fieldset" className="toggle">
          <RadioGroup row aria-label="chart" name="chart" value={chartDisplay}>
            <FormControlLabel
              value="month"
              control={<Radio />}
              label="month"
              onClick={() => setChartDisplay('month')}
            />
            <FormControlLabel
              value="quarter"
              control={<Radio />}
              label="quarter"
              onClick={() => setChartDisplay('quarter')}
            />
          </RadioGroup>
        </FormControl>
        <Line
          data={{
            labels: x_axis,
            datasets: [
              {
                label: 'Income',
                data: x_axis.length === 12 ? monthlyIncome : quarterlyIncome,
                borderColor: ['#3A89F0'],
                pointBackgroundColor: '#FFFFFF',
                pointBorderColor: 'black',
                fill: false,
                lineTension: 0
              },
              {
                label: 'Expense',
                data: x_axis.length === 12 ? monthlyExpense : quarterlyExpense,
                borderColor: ['#A61919'],
                pointBackgroundColor: '#FFFFFF',
                pointBorderColor: 'black',
                lineTension: 0,
                fill: false
              }
            ]
          }}
          height={350}
          width={600}
          options={{
            maintainAspectRatio: false,
            responsive: true,
            title: {
              display: true
            }
          }}
        />
      </div>
      <div className="pie__chart">
        <Pie
          data={{
            labels: ['Income', 'Expense'],
            datasets: [
              {
                data: [monthlyIncome[new Date().getMonth()], monthlyExpense[new Date().getMonth()]],
                backgroundColor: ['#3A89F0', '#A61919']
              }
            ]
          }}
          height={350}
          width={600}
          options={{
            maintainAspectRatio: false,
            title: {
              display: true,
              text: `Income vs Expense ${new Date().toLocaleString('default', {
                month: 'long'
              })} 2021`,
              fontSize: 18
            }
          }}
        />
      </div>
      <div className="accounting__top">
        <h1 className="title">Top 3 clients</h1>
      </div>
      {topClients.map(client => (
        <Card className="customer__card" key={client.customerId}>
          <CardContent>
            <div className="thumbnail">
              <img
                src={
                  topClients.indexOf(client) === 0
                    ? goldMedal
                    : topClients.indexOf(client) === 1
                    ? silverMedal
                    : bronzeMedal
                }
                alt="medal"
              />
            </div>
            <div className="content">
              <h3 className="card__title">{client.name}</h3>
              <p className="email">{client.email}</p>
              <p>Revenue: ${client.totalSpent.toLocaleString()}</p>
              <p>Number of Orders: {client.numOrders}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </main>
  );
}
