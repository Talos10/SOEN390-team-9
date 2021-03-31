import { Line } from 'react-chartjs-2';

import './Accounting.scss';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import goldMedal from '../../assets/accounting/gold-medal.png';
import silverMedal from '../../assets/accounting/silver-medal.png';
import bronzeMedal from '../../assets/accounting/bronze-medal.png';

export default function Accounting() {

return (
    <main className="Accouting">
        <div className='accounting__top'>
            <h1 className='title'>Overview</h1>
        </div>
        <div className='overview__card'>
            <hr className='line line__income'></hr>
            <h2 className='income__title'>Income</h2>
            <p>$17 000</p>
        </div>
        <div className='overview__card'>
            <hr className='line line__expense'></hr>
            <h2 className='expense__title'>Expenses</h2>
            <p>$10 000</p>
        </div>
        <div className='overview__card'>
            <hr className='line line__gross__revenue'></hr>
            <h2 className='gross__revenue__title'>Gross Revenue</h2>
            <p>+$7 000</p>
        </div>
        <div className='accounting__top'>
            <h1 className='title'>Income vs Expense</h1>
        </div>
        <div>
            <Line
                data={{
                    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                    datasets: [
                        {
                            label: 'Income',
                            data: [12, 19, 3, 5, 0, 25, 54, 32, 76, 44, 12, 32],
                            borderColor: [
                                'rgba(65, 105, 225, 0.5)',
                            ],
                            fill: false,
                            lineTension: 0,
                        },
                        {
                            label: 'Expense',
                            data: [47, 52, 67, 58, 9, 50, 36, 21, 57, 24, 21, 12],
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
            <h1 className='title'>Top 3 clients</h1>
        </div>
        <Card className='customer__card'> 
            <CardContent>
                <div className="thumbnail">
                    <img src={goldMedal} alt='gold medal'/>
                </div>
                <div className="content">
                    <h3 className="card__title">David Johnson</h3>
                    <p className='email'>davidj@yahoo.com</p>
                    <p>Revenue: $5000</p>
                    <p># of Orders: 10</p>
                </div>
            </CardContent>
        </Card>
        <Card className='customer__card'> 
            <CardContent>
                <div className="thumbnail">
                    <img src={silverMedal} alt='silver medal'/>
                </div>
                <div className="content">
                    <h3 className="card__title">Adam Doug</h3>
                    <p className='email'>adam@gmail.com</p>
                    <p>Revenue: $5000</p>
                    <p># of Orders: 10</p>
                </div>
            </CardContent>
        </Card>
        <Card className='customer__card'> 
            <CardContent>
                <div className="thumbnail">
                    <img src={bronzeMedal} alt='bronze medal'/>
                </div>
                <div className="content">
                    <h3 className="card__title">Mike Peterson</h3>
                    <p className='email'>mike@hotmail.com</p>
                    <p>Revenue: $5000</p>
                    <p># of Orders: 10</p>
                </div>
            </CardContent>
        </Card>
    </main>
  );
}