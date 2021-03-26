import './Accounting.scss';

export default function Accounting() {

return (
    <main className="Accouting">
        <div className='accounting__top'>
            <h1 className='title'>Overview</h1>
        </div>
        <div className='overview__card'>
            <hr className='line income'></hr>
            <h2 className='income'>Income</h2>
            <p>$17 000</p>
        </div>
        <div className='overview__card'>
            <hr className='line expense'></hr>
            <h2 className='expense'>Expenses</h2>
            <p>$10 000</p>
        </div>
        <div className='overview__card'>
            <hr className='line gross__revenue'></hr>
            <h2 className='gross__revenue'>Gross Revenue</h2>
            <p>+$7 000</p>
        </div>
        <div className='accounting__top'>
            <h1 className='title'>Chart</h1>
        </div>
        <div className='accounting__top'>
            <h1 className='title'>Top 3 clients</h1>
        </div>
    </main>
  );
}